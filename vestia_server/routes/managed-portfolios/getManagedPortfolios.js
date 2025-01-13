const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('', async (req, res, next) => {
  try {
    const result = await pool.query('select managed_portfolio_id, managed_portfolio_name, allocation, managed_portfolio_details from managed_portfolio');
    res.json(result.rows);
  } catch (err) {
    next(err); // Pass errors to error handling middleware
  }
});

module.exports = router;