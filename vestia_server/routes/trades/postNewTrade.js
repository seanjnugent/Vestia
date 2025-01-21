const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.post('/new-trade', async (req, res) => {
    const {
        account_id,
        trade_type,
        trade_mode,
        assets, // JSON string of assets
        currency_code,
        trade_note
    } = req.body;

    console.log('Received payload:', req.body);

    // Parse assets if it's a JSON string
    let parsedAssets;
    try {
        parsedAssets = typeof assets === 'string' ? JSON.parse(assets) : assets;
        console.log('Parsed assets:', parsedAssets);
    } catch (err) {
        console.error('Error parsing assets:', err);
        return res.status(400).json({ message: 'Invalid JSON format for assets' });
    }

    // Validate required inputs
    if (!account_id || !trade_type || !trade_mode || !parsedAssets || !Array.isArray(parsedAssets)) {
        console.error('Missing or invalid required fields');
        return res.status(400).json({ message: 'Missing or invalid required fields' });
    }

    // Normalize trade_type to ensure it matches 'Buy' or 'Sell'
    const normalizedTradeType = trade_type.charAt(0).toUpperCase() + trade_type.slice(1).toLowerCase();
    if (normalizedTradeType !== 'Buy' && normalizedTradeType !== 'Sell') {
        return res.status(400).json({ message: 'Invalid trade_type. Must be "Buy" or "Sell".' });
    }

    try {
        // Call the PostgreSQL function
        const result = await pool.query(
            `
            SELECT * FROM public.post_new_trade_multiple(
                $1::integer, -- account_id
                $2::varchar, -- trade_type
                $3::varchar, -- trade_mode
                $4::jsonb,   -- assets
                $5::varchar, -- currency_code
                $6::varchar  -- trade_note
            );
            `,
            [
                account_id,
                normalizedTradeType, // Use normalized trade_type
                trade_mode,
                JSON.stringify(parsedAssets), // Convert array to JSON string
                currency_code || 'USD',
                trade_note || null
            ]
        );

        console.log('Database result:', result.rows);

        // If no result, return an error message
        if (result.rows.length === 0) {
            console.error('Trade could not be processed');
            return res.status(400).json({ message: 'Trade could not be processed' });
        }

        // Return the trade result
        res.status(201).json({
            message: 'Trade posted successfully',
            trades: result.rows // Array of results for each asset
        });
    } catch (err) {
        console.error('Error processing trade:', err);
        res.status(500).json({ error: 'An error occurred while processing the trade.' });
    }
});

module.exports = router;
