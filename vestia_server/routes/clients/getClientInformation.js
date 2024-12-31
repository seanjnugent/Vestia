const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/:clientId', async (req, res, next) => {
  const { clientId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM get_client_information($1)', [clientId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err); // Pass errors to error handling middleware
  }
});

module.exports = router;
