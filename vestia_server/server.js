const express = require('express');
const app = express();
const clientRoutes = require('./routes/client'); // Import the client routes
const cors = require('cors'); // Enable CORS if needed

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors()); // If you need to enable cross-origin requests

// Set up the client routes
app.use('/api/clients', clientRoutes);

// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
