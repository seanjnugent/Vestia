const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
//const kafkaService = require('./services/kafkaService');

app.use(cors());

// Middleware
app.use(express.json());

// Import routes and dynamically register them
const accountRoutes = require('./routes/accounts');
const clientRoutes = require('./routes/clients');  // This should load /clients/postClientAuthentication.js as /clients/login
const tradeRoutes = require('./routes/trades');
const paymentRoutes = require('./routes/payments');
const assetRoutes = require('./routes/assets');
const managedPortfolioRoutes = require('./routes/managed-portfolios');
const bankAccountRoutes = require('./routes/bank-accounts');
//const priceRoutes = require('./routes/prices');

// Use the routes
app.use('/api/accounts', accountRoutes);
app.use('/api/clients', clientRoutes);  // This should now correctly register /clients/login
app.use('/api/trades', tradeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/managed-portfolios', managedPortfolioRoutes);
app.use('/api/bank-accounts', bankAccountRoutes);
//app.use('/api/prices', priceRoutes);


// Test Route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
  try {    
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

