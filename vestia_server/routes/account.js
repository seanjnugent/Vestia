
const express = require('express');
const router = express.Router();
const pool = require('../database');

// get accounts for client
router.get('/client-accounts/:client_id', async (req, res) => {
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

// Get account summary
router.get('/account-summary/:account_id', async (req, res) => {
  const { account_id } = req.params; // Fix to use account_id

  try {
    const result = await pool.query(
      'SELECT * FROM get_account_summary($1)', 
      [account_id] // Pass account_id to the query
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

router.get('/account-history/:account_id', async (req, res) => {
  const { account_id } = req.params; // Fix to use account_id

  try {
    const result = await pool.query(
      'SELECT * FROM account_history where account_id = $1', 
      [account_id] // Pass account_id to the query
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

// Get account holdings
router.get('/account-holdings/:account_id', async (req, res) => {
  const { account_id } = req.params; // Fix to use account_id

  try {
    const result = await pool.query(
      'SELECT * FROM get_account_holdings($1)', 
      [account_id] // Pass account_id to the query
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No holdings found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching holdings:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
