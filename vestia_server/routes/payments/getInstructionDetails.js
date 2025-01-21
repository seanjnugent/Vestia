const express = require('express');
const router = express.Router();
const pool = require('../../database');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT * FROM get_instruction_details($1)
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Instruction not found" });
    }

    const instruction = result.rows[0];

    // Parse the allocation field if it is a string
    if (typeof instruction.allocation === 'string') {
      instruction.allocation = JSON.parse(instruction.allocation);
    }

    res.json(instruction);
  } catch (error) {
    console.error("Error fetching instruction details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
