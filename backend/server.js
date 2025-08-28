// server.js
require('dotenv').config({ path: '.env' }); // ✅ Must be first
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
const Web3 = require('web3');

const authRoutes = require('./routes/auth');
const app = express();

// --------------------------
// Environment checks
// --------------------------
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not set in .env');
}
if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY not set in .env');
}
if (!process.env.LAND_REGISTRY_ADDRESS) {
  throw new Error('LAND_REGISTRY_ADDRESS not set in .env');
}
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET not set in .env');
}

// --------------------------
// PostgreSQL connection
// --------------------------
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL: landdb');
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    throw err;
  }
};

// --------------------------
// Models
// --------------------------
const LandMetadata = sequelize.define('LandMetadata', {
  landId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  ownerName: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  area: { type: DataTypes.INTEGER, allowNull: false },
  nin: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  village: { type: DataTypes.STRING },
  parish: { type: DataTypes.STRING },
  subCounty: { type: DataTypes.STRING },
  county: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  nextOfKinName: { type: DataTypes.STRING },
  nextOfKinPhone: { type: DataTypes.STRING },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  registeredBy: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'land_metadata' });

// Sync database
sequelize.sync({ alter: true })
  .then(() => console.log('Database tables created/updated'))
  .catch(err => console.error('Database sync error:', err));

// --------------------------
// Web3 Setup
// --------------------------
const web3 = new Web3(process.env.WEB3_PROVIDER || 'http://127.0.0.1:8545');
const LandRegistryABI = require('./LandRegistry.json').abi;
const landRegistryAddress = process.env.LAND_REGISTRY_ADDRESS;
const contract = new web3.eth.Contract(LandRegistryABI, landRegistryAddress);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

console.log('Web3 Setup:', {
  LAND_REGISTRY_ADDRESS: landRegistryAddress,
  WEB3_PROVIDER: process.env.WEB3_PROVIDER
});

// --------------------------
// Middleware
// --------------------------
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;

// Protect routes
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(403).json({ message: 'Malformed token' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  });
}

// --------------------------
// Routes
// --------------------------
app.use('/api/auth', authRoutes);

// Register land route
app.post('/api/registerLand', authenticate, async (req, res) => {
  const { firstName, surname, phone, village, parish, subCounty, county, district, region, area, nin, nokName, nokPhone, latitude, longitude, account: userAccount } = req.body;

  if (!firstName || !surname || !village || !parish || !subCounty || !county || !district || !region || !area || !nin || !userAccount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const ownerName = `${firstName.trim()} ${surname.trim()}`.trim();
  const location = `${village}, ${parish}, ${subCounty}, ${county}, ${district}, ${region}`.replace(/(, )+/g, ', ').trim();
  const scaledLatitude = Math.round(parseFloat(latitude || 0) * 1e6);
  const scaledLongitude = Math.round(parseFloat(longitude || 0) * 1e6);

  try {
    const tx = await contract.methods
      .registerLand(
        ownerName,
        location,
        village,
        parish,
        subCounty,
        county,
        district,
        region,
        parseInt(area),
        nin,
        phone || '',
        nokName || '',
        nokPhone || '',
        scaledLatitude,
        scaledLongitude
      )
      .send({ from: userAccount, gas: 1500000 });

    const landId = await contract.methods.landCount().call();

    await LandMetadata.create({
      landId,
      ownerName,
      location,
      area: parseInt(area),
      nin,
      phone,
      village,
      parish,
      subCounty,
      county,
      district,
      region,
      nextOfKinName: nokName || '',
      nextOfKinPhone: nokPhone || '',
      latitude: parseFloat(latitude) || null,
      longitude: parseFloat(longitude) || null,
      registeredBy: userAccount
    });

    res.status(200).json({
      message: 'Land registered',
      transactionHash: tx.transactionHash,
      blockNumber: tx.blockNumber,
      gasUsed: tx.gasUsed,
      landId
    });
  } catch (error) {
    console.error('Register Land Error:', error);
    res.status(500).json({ message: 'Error registering land', error: error.message });
  }
});

// Fetch land by ID
app.get('/api/land/:id', authenticate, async (req, res) => {
  try {
    const landId = req.params.id;
    const land = await contract.methods.getLand(landId).call();
    if (!land[0]) return res.status(404).json({ message: 'Land not found' });
    const metadata = await LandMetadata.findOne({ where: { landId } });

    res.status(200).json({
      id: landId,
      ownerName: land[0],
      location: land[1],
      village: land[2],
      parish: land[3],
      subCounty: land[4],
      county: land[5],
      district: land[6],
      region: land[7],
      area: land[8],
      nin: land[9],
      phone: land[10],
      nextOfKinName: land[11],
      nextOfKinPhone: land[12],
      latitude: parseFloat(land[13]) / 1e6,
      longitude: parseFloat(land[14]) / 1e6,
      owner: land[15]
    });
  } catch (error) {
    console.error('Fetch Land Error:', error);
    res.status(500).json({ message: 'Error fetching land', error: error.message });
  }
});

// Fetch all lands
app.get('/api/lands', authenticate, async (req, res) => {
  try {
    const landCount = await contract.methods.landCount().call();
    const lands = [];

    for (let i = 1; i <= landCount; i++) {
      const land = await contract.methods.getLand(i).call();
      const metadata = await LandMetadata.findOne({ where: { landId: i } });
      lands.push({
        landId: i,
        ownerName: land[0],
        location: land[1],
        village: land[2],
        parish: land[3],
        subCounty: land[4],
        county: land[5],
        district: land[6],
        region: land[7],
        area: land[8],
        nin: land[9],
        phone: land[10],
        nextOfKinName: land[11],
        nextOfKinPhone: land[12],
        latitude: parseFloat(land[13]) / 1e6,
        longitude: parseFloat(land[14]) / 1e6,
        owner: land[15],
        cachedLatitude: metadata?.latitude || null,
        cachedLongitude: metadata?.longitude || null,
        cachedNextOfKinName: metadata?.nextOfKinName || '',
        cachedNextOfKinPhone: metadata?.nextOfKinPhone || ''
      });
    }

    res.status(200).json(lands);
  } catch (error) {
    console.error('Fetch Lands Error:', error);
    res.status(500).json({ message: 'Error fetching lands', error: error.message });
  }
});

// Fetch transaction details
app.get('/api/transaction/:hash', authenticate, async (req, res) => {
  try {
    const txReceipt = await web3.eth.getTransactionReceipt(req.params.hash);
    if (!txReceipt) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json({
      transactionHash: txReceipt.transactionHash,
      blockNumber: txReceipt.blockNumber,
      gasUsed: txReceipt.gasUsed,
      from: txReceipt.from,
      to: txReceipt.to,
      contractAddress: txReceipt.contractAddress || null,
      status: txReceipt.status ? 'Success' : 'Failed'
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Error fetching transaction details', error: error.message });
  }
});

// --------------------------
// Start server
// --------------------------
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('LandRegistry address:', landRegistryAddress);
  });
};

startServer();
