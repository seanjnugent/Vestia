const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

// Import routes
const clientRoutes = require('./routes/client');
const accountRoutes = require('./routes/account');
const tradeRoutes = require('./routes/trade');
const paymentRoutes = require('./routes/payment');

// Use routes
app.use('/api/clients', clientRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});



// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});