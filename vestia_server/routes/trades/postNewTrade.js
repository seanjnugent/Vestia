const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.post('', async (req, res) => {
    const {
        account_id,
        asset_id,
        trade_type,
        trade_mode,
        units,
        value,
        currency_code,
        trade_note
    } = req.body;

    // Validate required inputs
    if (!account_id || !asset_id || !trade_type || !trade_mode) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Call the `post_new_trade` function in the PostgreSQL database
        const result = await pool.query(
            `
            SELECT * FROM public.post_new_trade(
                $1::integer,
                $2::integer,
                $3::varchar,
                $4::varchar,
                $5::numeric,
                $6::numeric,
                $7::varchar,
                $8::varchar
            );
            `,
            [
                account_id,
                asset_id,
                trade_type,
                trade_mode,
                units || null,
                value || null,
                currency_code || 'USD',
                trade_note || null
            ]
        );

        // If no result, return an error message
        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Trade could not be processed' });
        }

        // Return the trade result
        res.status(201).json({
            message: 'Trade posted successfully',
            trade: result.rows[0] // Expected to contain asset_trade_id, cash_trade_id, and message
        });
    } catch (err) {
        console.error('Error processing trade:', err);
        res.status(500).json({ error: 'An error occurred while processing the trade.' });
    }
});

module.exports = router;
