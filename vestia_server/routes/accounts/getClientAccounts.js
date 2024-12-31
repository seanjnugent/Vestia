const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/:client_id', async (req, res) => {
  const { client_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM get_client_accounts($1)', 
      [client_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No accounts found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching accounts:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
