const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { country, account_type, bank_account_details } = req.body;
  
    try {
      await pool.query(
        'SELECT update_bank_account($1, $2, $3, $4)',
        [id, country, account_type, JSON.stringify(bank_account_details)]
      );
      res.json({ message: 'Bank account updated successfully' });
    } catch (err) {
      console.error('Error updating bank account:', err);
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;


  
 