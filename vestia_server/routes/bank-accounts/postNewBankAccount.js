const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.post('', async (req, res) => {
    const { client_id, country, account_type, bank_account_details } = req.body;
    
    try {
      const result = await pool.query(
        'SELECT insert_bank_account($1, $2, $3, $4)', 
        [client_id, country, account_type, JSON.stringify(bank_account_details)]
      );
  
      res.json({ id: result.rows[0].insert_bank_account });
    } catch (err) {
      console.error('Error inserting bank account:', err);
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;

