
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Get currency setting
router.get('/currency', settingsController.getCurrencySetting);

// Update currency setting
router.put('/currency', settingsController.updateCurrencySetting);

module.exports = router;
