
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Get all sales
router.get('/', salesController.getAllSales);

// Get a single sale
router.get('/:id', salesController.getSaleById);

// Create a sale
router.post('/', salesController.createSale);

module.exports = router;
