// b) Backend (Node.js with Express) to execute the function

const express = require('express');
const router = express.Router();
const pool = require('../../database'); // Your database connection pool

router.post('', async (req, res, next) => {
    try {
        const { account_id, instruction_type, instruction_details, allocation  } = req.body;

        // Validate input data (important!)
        if (!account_id || !instruction_type || !instruction_details || !allocation ) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Execute the PostgreSQL function
        const result = await pool.query(
            'SELECT public.post_new_instruction($1, $2, $3::json, $4::json)',
            [account_id, instruction_type, instruction_details, allocation]
        );
        

        const newInstructionId = result.rows[0].post_new_regular_instruction;

        if (newInstructionId == -1) {
            return res.status(500).json({ error: 'Error inserting data into database.' });
        }

        res.status(201).json({ message: 'Instruction created successfully.', instruction_id: newInstructionId });
    } catch (err) {
        console.error("Error creating instruction:", err); // Log the full error for debugging
        res.status(500).json({ error: 'Failed to create instruction.', details: err.message}); // Send a more generic error to the client
    }
});

module.exports = router;