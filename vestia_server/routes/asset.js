const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/assets/:asset_type?', async (req, res) => {
  const { asset_type } = req.params;

  try {
    // If asset_type is not provided, pass null to the function
    const result = await pool.query(
      'SELECT * FROM get_assets($1)', 
      [asset_type || null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No assets found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching assets:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
