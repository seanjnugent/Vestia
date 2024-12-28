
const express = require('express');
const router = express.Router();
const pool = require('../database');

// Get active clients
router.get('/active', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM client WHERE status = $1', ['active']);
    res.json(result.rows);
  } catch (err) {
    next(err); // Pass errors to error handling middleware
  }
});

router.get('/client-performance/:client_id', async (req, res) => {
  const { client_id } = req.params;

  try {
    // Call the stored procedure 'get_client_performance' with client_id
    const result = await pool.query(
      'SELECT * FROM get_client_performance($1)', 
      [client_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Client performance not found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching client performance:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email_address, password } = req.body;

  try {
    // Fetch the client with the provided email
    const clientResult = await pool.query(
      'SELECT client_id, email_address, password, date_last_login FROM client WHERE email_address = $1',
      [email_address]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const client = clientResult.rows[0];

    // Verify password (adjust if using hashed passwords in the future)
    if (client.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update the last_login_date
    await pool.query(
      'UPDATE client SET date_last_login = CURRENT_TIMESTAMP WHERE client_id = $1',
      [client.client_id]
    );

    // Return client_id as userId
    res.json({ userId: client.client_id });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/new-client', async (req, res) => {
  const {
    firstName, // Adjust property names to match your request body
    surname,
    dateOfBirth,
    countryOfResidence,
    residentialAddress,
    clientProfile,
    emailAddress,
    phoneNumber,
  } = req.body;

  try {
    // Validate required fields (optional, adjust as needed)
    if (!firstName || !surname || !dateOfBirth || !emailAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const clientData = [
      firstName,
      surname,
      dateOfBirth,
      countryOfResidence,
      residentialAddress,
      clientProfile,
      emailAddress,
      phoneNumber,
    ];

    // Call the stored procedure with client data
    const result = await pool.query('SELECT * FROM post_new_client($1, $2, $3, $4, $5, $6, $7, $8)', clientData);

    // Check for successful insertion (optional)
    if (result.rowCount === 0) {
      return res.status(500).json({ error: 'Client creation failed' });
    }

    res.status(201).json({ message: 'Client created successfully' });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;