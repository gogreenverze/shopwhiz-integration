
const db = require('../db');
const { generateId } = require('../../utils/formatters');

// Get all sales
const getAllSales = (req, res) => {
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
};

// Get a single sale
const getSaleById = (req, res) => {
  db.get('SELECT * FROM sales WHERE id = ?', [req.params.id], (err, sale) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    db.all('SELECT * FROM sale_items WHERE saleId = ?', [req.params.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ ...sale, items });
    });
  });
};

// Create a sale
const createSale = (req, res) => {
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
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale
};
