const express = require('express');
// const Web3 = require('web3');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const LandRegistryABI = require('./artifacts/contracts/LandRegistry.sol/LandRegistry.json').abi;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = new ethers.Wallet('PRIVATE_KEY', provider);
const contractAddress = 'DEPLOYED_CONTRACT_ADDRESS';
const contract = new ethers.Contract(contractAddress, LandRegistryABI, signer);

// Register Land
app.post('/registerLand', async (req, res) => {
    const { ownerName, location, area } = req.body;
    try {
        const tx = await contract.registerLand(ownerName, location, area);
        await tx.wait();
        res.status(200).json({ message: 'Land registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering land', error });
    }
});

// Query Land
app.get('/land/:id', async (req, res) => {
    try {
        const landId = parseInt(req.params.id);
        const [ownerName, location, area, owner] = await contract.getLand(landId);
        res.status(200).json({ landId, ownerName, location, area, owner });
    } catch (error) {
        res.status(404).json({ message: 'Land not found', error });
    }
});

// Fetch All Lands
app.get('/lands', async (req, res) => {
    try {
        const lands = await contract.getAllLands();
        res.status(200).json(lands);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lands', error });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
