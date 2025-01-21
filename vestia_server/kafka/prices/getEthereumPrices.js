const express = require('express');
const router = express.Router();
const kafkaService = require('../kafkaService')

// Store the latest ETH price
let latestEthPrice = null;

// Consume ETH prices from the 'demo-topic' Kafka topic
kafkaService.consume('demo-topic', (message) => {
  console.log('Received ETH price from Kafka:', message);
  if (message && message.price) {
    latestEthPrice = message.price;
    console.log('Updated latest ETH price to:', latestEthPrice);
  } else {
    console.log('Received malformed message:', message);
  }
});


// API endpoint to get the latest ETH price
router.get('/latest', (req, res) => {
  console.log('Latest ETH price when API called:', latestEthPrice);
  if (latestEthPrice) {
    res.json({ price: latestEthPrice });
  } else {
    res.status(404).json({ error: 'ETH price data not available' });
  }
});

module.exports = router;