
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get dashboard summary
router.get('/summary', (req, res) => {
  const timeRange = req.query.timeRange || 'today';
  let dateFilter;
  
  const now = new Date();
  switch (timeRange) {
    case 'today':
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      break;
    case 'yesterday':
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
      break;
    case 'last7days':
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
      break;
    case 'last30days':
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();
      break;
    case 'thisMonth':
      dateFilter = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      break;
    case 'lastMonth':
      dateFilter = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      break;
    default:
      dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  }
  
  db.all(
    'SELECT SUM(grandTotal) as totalSales, COUNT(*) as totalTransactions FROM sales WHERE createdAt >= ?',
    [dateFilter],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const totalSales = rows[0].totalSales || 0;
      const totalTransactions = rows[0].totalTransactions || 0;
      const averageOrder = totalTransactions > 0 ? totalSales / totalTransactions : 0;
      
      // Get previous period data for comparison
      let prevDateFilter;
      switch (timeRange) {
        case 'today':
          prevDateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
          break;
        case 'yesterday':
          prevDateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString();
          break;
        case 'last7days':
          prevDateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).toISOString();
          break;
        case 'last30days':
          prevDateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60).toISOString();
          break;
        case 'thisMonth':
          prevDateFilter = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
          break;
        case 'lastMonth':
          prevDateFilter = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
          break;
        default:
          prevDateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
      }
      
      db.get(
        'SELECT SUM(grandTotal) as prevTotalSales FROM sales WHERE createdAt >= ? AND createdAt < ?',
        [prevDateFilter, dateFilter],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          const prevTotalSales = row?.prevTotalSales || 0;
          const compareToLastPeriod = prevTotalSales > 0 
            ? ((totalSales - prevTotalSales) / prevTotalSales) * 100 
            : 0;
          
          res.json({
            totalSales,
            totalTransactions,
            averageOrder,
            compareToLastPeriod
          });
        }
      );
    }
  );
});

// Get daily sales data for charts
router.get('/dailySales', (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const result = [];
  
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    const nextDateString = nextDate.toISOString().split('T')[0];
    
    // Use Promise to handle asynchronous DB calls
    result.push(
      new Promise((resolve) => {
        db.get(
          'SELECT SUM(grandTotal) as total FROM sales WHERE createdAt >= ? AND createdAt < ?',
          [`${dateString}T00:00:00.000Z`, `${nextDateString}T00:00:00.000Z`],
          (err, row) => {
            if (err) {
              console.error(err);
              resolve({ date: dateString, total: 0 });
            } else {
              resolve({ date: dateString, total: row?.total || 0 });
            }
          }
        );
      })
    );
  }
  
  Promise.all(result)
    .then(dailySales => res.json(dailySales))
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
