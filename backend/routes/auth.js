// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const { Pool } = require('pg'); // Import pg pool for PostgreSQL

require('dotenv').config({ path: 'LandRegistry.env' }); // ensure env loaded here or in server.js

const LandRegistry = require('../LandRegistry.json');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const WEB3_PROVIDER = process.env.WEB3_PROVIDER || 'http://localhost:8545';
const LAND_REGISTRY_ADDRESS = process.env.LAND_REGISTRY_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!JWT_SECRET || !LAND_REGISTRY_ADDRESS || !PRIVATE_KEY) {
  throw new Error('Required environment variables missing');
}

const contractABI = LandRegistry.abi;

// Web3 Setup
const web3 = new Web3(WEB3_PROVIDER);
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
const contract = new web3.eth.Contract(contractABI, LAND_REGISTRY_ADDRESS);

// PostgreSQL setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Add this to your LandRegistry.env
});

console.log('Auth Module Using account:', account.address);

// Register route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const passwordHash = web3.utils.sha3(password);

    // Check if user exists in PostgreSQL
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert user into PostgreSQL
    await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
      [username, passwordHash]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const passwordHash = web3.utils.sha3(password);

    // Fetch user from PostgreSQL
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.password_hash !== passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username, address: account.address }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;
