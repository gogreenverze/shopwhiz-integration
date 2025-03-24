const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { generateId } = require('../utils/formatters');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.head('/api/settings/health', (req, res) => {
  res.status(200).end();
});

app.get('/api/settings/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Products API
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, stock, category, image, barcode } = req.body;
  const id = generateId();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO products (id, name, description, price, stock, category, image, barcode, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, description, price, stock, category, image, barcode, now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { name, description, price, stock, category, image, barcode } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ?, barcode = ?, updatedAt = ? WHERE id = ?',
    [name, description, price, stock, category, image, barcode, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  });
});

// Customers API
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Sales API
app.get('/api/sales', (req, res) => {
  db.all('SELECT * FROM sales ORDER BY createdAt DESC', (err, sales) => {
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
  });
});

app.post('/api/sales', (req, res) => {
  const { items, total, tax, grandTotal, paymentMethod, status, customerId, customerName } = req.body;
  const id = generateId();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO sales (id, total, tax, grandTotal, paymentMethod, status, customerId, customerName, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, total, tax, grandTotal, paymentMethod, status, customerId, customerName, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Insert sale items
      const insertItemPromises = items.map((item, index) => {
        return new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO sale_items (id, saleId, productId, productName, quantity, unitPrice, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [`${id}-${index}`, id, item.productId, item.productName, item.quantity, item.unitPrice, item.total],
            function(err) {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      });

      Promise.all(insertItemPromises)
        .then(() => {
          // Update product stock
          const updateStockPromises = items.map(item => {
            return new Promise((resolve, reject) => {
              db.run(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.productId],
                function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          });

          return Promise.all(updateStockPromises);
        })
        .then(() => {
          // If customer exists, update their total spent and total orders
          if (customerId) {
            return new Promise((resolve, reject) => {
              db.run(
                'UPDATE customers SET totalSpent = totalSpent + ?, totalOrders = totalOrders + 1 WHERE id = ?',
                [grandTotal, customerId],
                function(err) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                }
              );
            });
          }
          return Promise.resolve();
        })
        .then(() => {
          // Return the created sale with its items
          db.get('SELECT * FROM sales WHERE id = ?', [id], (err, sale) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            
            db.all('SELECT * FROM sale_items WHERE saleId = ?', [id], (err, saleItems) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }
              
              res.status(201).json({ ...sale, items: saleItems });
            });
          });
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    }
  );
});

// Dashboard API
app.get('/api/dashboard/summary', (req, res) => {
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
app.get('/api/dashboard/dailySales', (req, res) => {
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

// Settings API
app.get('/api/settings/currency', (req, res) => {
  db.get('SELECT value FROM settings WHERE key = "currency"', (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ currency: row?.value || 'USD' });
  });
});

app.put('/api/settings/currency', (req, res) => {
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

// Reports API
app.get('/api/reports/sales', (req, res) => {
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

app.get('/api/reports/products', (req, res) => {
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

app.get('/api/reports/sales/by-category', (req, res) => {
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

app.get('/api/reports/sales/by-time', (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

