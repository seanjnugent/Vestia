
const express = require('express');
const router = express.Router();
const pool = require('../database');

// Get active clients
router.get('/active', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM client WHERE status = $1', ['active']);
    res.json(result.rows);
  } catch (err) {
    next(err); // Pass errors to error handling middleware
  }
});

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