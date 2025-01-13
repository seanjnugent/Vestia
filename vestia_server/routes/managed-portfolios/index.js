const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

// Read all the route files in the current directory (excluding this file)
fs.readdirSync(__dirname).forEach(file => {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const route = require(path.join(__dirname, file));  // Dynamically require the route file
    const routePath = `/${file.replace('.js', '')}`;    // Use the file name as the route path
    router.use(routePath, route);  // Register the route
  }
});

module.exports = router;
