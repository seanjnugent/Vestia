const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/:client_id', async (req, res) => {
  const { client_id } = req.params;
  const { start_date, end_date } = req.query; // Fetching start_date and end_date from query parameters

  try {
    const result = await pool.query(
      `SELECT * FROM get_client_performance($1, $2, $3)`,
      [client_id, start_date, end_date] // Passing client_id, start_date, and end_date to the query
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No client performance data found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client performance data:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
