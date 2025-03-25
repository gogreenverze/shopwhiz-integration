
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Get sales reports
router.get('/sales', reportController.getSalesReports);

// Get products reports
router.get('/products', reportController.getProductsReports);

// Get sales by category
router.get('/sales/by-category', reportController.getSalesByCategory);

// Get sales by time period
router.get('/sales/by-time', reportController.getSalesByTime);

module.exports = router;
