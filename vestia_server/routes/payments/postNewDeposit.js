const express = require('express');
const router = express.Router();
const pool = require('../../database'); // Your database connection pool

router.post('', async (req, res, next) => {
    try {
        const { account_id, amount, allocation } = req.body;

        // Validate input data
        if (!account_id || !amount) {
            return res.status(400).json({ error: 'Missing required fields: account_id and amount are required.' });
        }

        // Convert allocation to a JSON string or default to an empty array
        const allocationJson = JSON.stringify(allocation || []);

        // Execute the PostgreSQL function
        const result = await pool.query(
            'SELECT public.post_new_deposit($1::integer, $2::numeric, $3::jsonb)',
            [account_id, amount, allocationJson]
        );

        res.status(201).json({ message: 'Deposit submitted successfully.' });
    } catch (err) {
        console.error("Error creating deposit:", err);
        res.status(500).json({ error: 'Failed to create deposit.', details: err.message });
    }
});

module.exports = router;
