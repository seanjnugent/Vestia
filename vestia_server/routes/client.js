const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

// Set up PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
});

const router = express.Router();

// GET all active clients
router.get('/active', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM client WHERE status = $1', ['active']);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching active clients:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET client performance using stored procedure
router.get('/client-performance/:client_id', async (req, res) => {
  const { client_id } = req.params;

  try {
    // Call the stored procedure 'get_client_performance' with client_id
    const result = await pool.query(
      'SELECT * FROM get_client_performance($1)', 
      [client_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client performance not found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client performance:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
