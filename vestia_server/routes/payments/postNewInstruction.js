// b) Backend (Node.js with Express) to execute the function

const express = require('express');
const router = express.Router();
const pool = require('../../database'); // Your database connection pool

router.post('', async (req, res, next) => {
    try {
        const {
            account_id,
            instruction_type,
            instruction_frequency,
            instruction_amount,
            bank_account_id,
            first_date,
            next_run_date,
            allocation
        } = req.body;

        // Validate input data
        if (
            !account_id ||
            !instruction_type ||
            !instruction_frequency ||
            !instruction_amount ||
            !bank_account_id ||
            !first_date ||
            !next_run_date ||
            !allocation
        ) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Convert allocation to a JSON string
        const allocationJson = JSON.stringify(allocation);

        // Execute the PostgreSQL function
        const result = await pool.query(
            'SELECT public.post_new_instruction($1, $2, $3, $4, $5, $6, $7, $8::json) AS instruction_id',
            [
                account_id,
                instruction_type,
                instruction_frequency,
                instruction_amount,
                bank_account_id,
                first_date,
                next_run_date,
                allocationJson
            ]
        );

        const newInstructionId = result.rows[0].instruction_id;

        if (newInstructionId === -1) {
            return res.status(500).json({ error: 'Error inserting data into the database.' });
        }

        res.status(201).json({ message: 'Instruction created successfully.', instruction_id: newInstructionId });
    } catch (err) {
        console.error("Error creating instruction:", err);
        res.status(500).json({ error: 'Failed to create instruction.', details: err.message });
    }
});


module.exports = router;