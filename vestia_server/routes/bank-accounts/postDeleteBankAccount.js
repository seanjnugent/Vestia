const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.query('SELECT soft_delete_bank_account($1)', [id]);
      res.json({ message: 'Bank account marked as deleted' });
    } catch (err) {
      console.error('Error deleting bank account:', err);
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;

