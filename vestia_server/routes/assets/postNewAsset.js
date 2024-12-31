const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/active', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM client WHERE status = $1', ['active']);
    res.json(result.rows);
  } catch (err) {
    next(err); // Pass errors to error handling middleware
  }
});

module.exports = router;