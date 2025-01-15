const express = require('express');
const router = express.Router();
const pool = require('../../database');

// Endpoint to create a new account
router.post('', async (req, res, next) => {
  const { client_id, account_type, account_name, managed_portfolio_id } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM post_new_account($1, $2, $3, $4)',
      [client_id, account_type, account_name, managed_portfolio_id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err); // Pass errors to error handling middleware
  }
});




module.exports = router;
