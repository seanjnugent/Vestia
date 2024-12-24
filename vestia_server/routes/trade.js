
const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/client-trades/:client_id', async (req, res) => {
  const { client_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM get_client_asset_trades($1)', 
      [client_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No trades found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trades:', err);
    res.status(500).json({ error: err.message });
  }
});



router.post('/buy-trade', async (req, res) => {
  const {
    account_id,
    asset_codes,  // Array of asset codes (e.g., ["AVGO"])
    quantities,   // Corresponding array of quantities for each asset (e.g., [1])
    description,  // Description for the trade
    status,       // Status of the trade (e.g., 'Completed')
  } = req.body;

  // Validate inputs
  if (!account_id || !asset_codes || !quantities || !description || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create the trade by calling a stored procedure or function in your DB (e.g., post_buy_trade)
    const result = await pool.query(
      `
      SELECT post_buy_trade(
        $1::integer,
        $2::varchar[],
        $3::integer[],
        $4::text,
        $5::text
      )
      `,
      [account_id, asset_codes, quantities, description, status]
    );

    // Assuming the stored procedure returns a success message or ID
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Trade could not be processed' });
    }

    res.status(201).json({ message: 'Buy trade created successfully', trade: result.rows[0] });
  } catch (err) {
    console.error('Error processing buy trade:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
 