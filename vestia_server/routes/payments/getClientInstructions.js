const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/:client_id', async (req, res) => {
    const { client_id } = req.params; // Get client_id from URL params
    const { account_id, instruction_type } = req.query; // Optional query params

    // Validate client_id
    if (!client_id) {
        return res.status(400).json({ message: 'Client ID is required' });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM get_client_instructions($1, $2, $3)', 
            [client_id, account_id || null, instruction_type || null] // Ensure NULL for optional params
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No instructions found for this client' });
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching instructions:', err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
