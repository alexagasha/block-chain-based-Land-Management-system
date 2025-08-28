// landRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Your PostgreSQL connection module
const authenticate = require('../middleware/authenticate'); // Your JWT auth middleware

// Register land (protected)
router.post('/registerLand', authenticate, async (req, res) => {
  const { ownerName, location, area, nin, ownerAddress } = req.body;

  if (!ownerName || !location || !area || !nin || !ownerAddress) {
    return res.status(400).json({ message: 'Missing land details' });
  }

  try {
    const insertQuery = `
      INSERT INTO lands (owner_name, location, area, nin, owner_address)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `;
    const values = [ownerName, location, area, nin, ownerAddress];
    const result = await db.query(insertQuery, values);

    res.status(201).json({ message: 'Land registered', landId: result.rows[0].id });
  } catch (error) {
    console.error('Register Land Error:', error);
    res.status(500).json({ message: 'Error registering land', error: error.message });
  }
});

// Get land by ID (protected)
router.get('/land/:id', authenticate, async (req, res) => {
  const landId = req.params.id;

  try {
    const query = 'SELECT * FROM lands WHERE id = $1';
    const result = await db.query(query, [landId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Land not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Fetch Land Error:', error);
    res.status(500).json({ message: 'Error fetching land', error: error.message });
  }
});

// Get all lands (protected)
router.get('/lands', authenticate, async (req, res) => {
  try {
    const query = 'SELECT * FROM lands ORDER BY id';
    const result = await db.query(query);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Fetch Lands Error:', error);
    res.status(500).json({ message: 'Error fetching lands', error: error.message });
  }
});

module.exports = router;
