
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get sales reports
router.get('/sales', (req, res) => {
  const { period, startDate, endDate } = req.query;
  
  let dateFilter = '';
  const params = [];
  
  if (startDate && endDate) {
    dateFilter = 'WHERE createdAt >= ? AND createdAt <= ?';
    params.push(startDate, endDate);
  } else if (period) {
    const now = new Date();
    let startDateValue;
    
    switch (period) {
      case 'daily':
        startDateValue = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        break;
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        startDateValue = weekStart.toISOString();
        break;
      case 'monthly':
        startDateValue = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        break;
      case 'yearly':
        startDateValue = new Date(now.getFullYear(), 0, 1).toISOString();
        break;
      default:
        startDateValue = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    }
    
    dateFilter = 'WHERE createdAt >= ?';
    params.push(startDateValue);
  }
  
  db.all(
    `SELECT * FROM sales ${dateFilter} ORDER BY createdAt DESC`,
    params,
    (err, sales) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // For each sale, get its items
      const promises = sales.map(sale => {
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM sale_items WHERE saleId = ?', [sale.id], (err, items) => {
            if (err) {
              reject(err);
            } else {
              resolve({ ...sale, items });
            }
          });
        });
      });

      Promise.all(promises)
        .then(salesWithItems => res.json(salesWithItems))
        .catch(err => res.status(500).json({ error: err.message }));
    }
  );
});

// Get products reports
router.get('/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name ASC', (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Get sales data to calculate sold quantities
    db.all('SELECT productId, SUM(quantity) as totalSold FROM sale_items GROUP BY productId', (err, soldData) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Create a map of product IDs to sold quantities
      const soldMap = {};
      soldData.forEach(item => {
        soldMap[item.productId] = item.totalSold;
      });
      
      // Add sold quantities to products
      const productsWithSales = products.map(product => ({
        ...product,
        sold: soldMap[product.id] || 0
      }));
      
      res.json(productsWithSales);
    });
  });
});

// Get sales by category
router.get('/sales/by-category', (req, res) => {
  db.all(
    `SELECT p.category, SUM(si.total) as totalSales, COUNT(si.id) as itemCount 
     FROM sale_items si 
     JOIN products p ON si.productId = p.id 
     GROUP BY p.category
     ORDER BY totalSales DESC`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Get sales by time period
router.get('/sales/by-time', (req, res) => {
  const { groupBy } = req.query;
  let timeFormat;
  
  switch (groupBy) {
    case 'hour':
      timeFormat = "strftime('%Y-%m-%d %H:00:00', createdAt)";
      break;
    case 'day':
      timeFormat = "strftime('%Y-%m-%d', createdAt)";
      break;
    case 'week':
      timeFormat = "strftime('%Y-%W', createdAt)";
      break;
    case 'month':
      timeFormat = "strftime('%Y-%m', createdAt)";
      break;
    default:
      timeFormat = "strftime('%Y-%m-%d', createdAt)";
  }
  
  db.all(
    `SELECT ${timeFormat} as timePeriod, SUM(grandTotal) as totalSales, COUNT(*) as transactionCount
     FROM sales
     GROUP BY timePeriod
     ORDER BY timePeriod DESC
     LIMIT 50`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;
