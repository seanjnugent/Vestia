const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/:account_id', async (req, res) => {
  const { account_id } = req.params;
  const { start_date, end_date } = req.query; // Fetching start_date and end_date from query parameters

  try {
    const result = await pool.query(
      `SELECT * FROM get_account_performance($1, $2, $3)`,
      [account_id, start_date, end_date] // Passing account_id, start_date, and end_date to the query
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No account performance data found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching account performance data:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
