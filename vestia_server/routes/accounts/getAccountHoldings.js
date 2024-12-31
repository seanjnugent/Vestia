const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/:account_id', async (req, res) => {
  const { account_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM get_account_holdings($1)', 
      [account_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No holdings found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching account holdings:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
