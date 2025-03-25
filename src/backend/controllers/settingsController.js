
const db = require('../db');

// Get currency setting
const getCurrencySetting = (req, res) => {
  db.get('SELECT value FROM settings WHERE key = "currency"', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ currency: row?.value || 'USD' });
  });
};

// Update currency setting
const updateCurrencySetting = (req, res) => {
  const { currency } = req.body;
  
  db.run(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['currency', currency],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ currency });
    }
  );
};

// Health check
const healthCheck = (req, res) => {
  res.status(200).json({ status: 'ok' });
};

module.exports = {
  getCurrencySetting,
  updateCurrencySetting,
  healthCheck
};
