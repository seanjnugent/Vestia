const express = require('express');
const app = express();
const db = require('./database');

app.use(express.json());

app.get('/', (req, res) => res.send('Backend is running!'));

// Example endpoint
app.get('/api/data', async (req, res) => {
  const result = await db.query('SELECT * FROM your_table');
  res.json(result.rows);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
