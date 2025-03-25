
const db = require('../db');
const { generateId } = require('../../utils/formatters');

// Get all products
const getAllProducts = (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get a single product
const getProductById = (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
};

// Create a product
const createProduct = (req, res) => {
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
};

// Update a product
const updateProduct = (req, res) => {
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
};

// Delete a product
const deleteProduct = (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
