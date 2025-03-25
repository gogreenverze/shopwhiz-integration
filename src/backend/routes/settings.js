
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get currency setting
router.get('/currency', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = "currency"', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ currency: row?.value || 'USD' });
  });
});

// Update currency setting
router.put('/currency', (req, res) => {
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
});

module.exports = router;
