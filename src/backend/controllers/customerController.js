
const db = require('../db');

// Get all customers
const getAllCustomers = (req, res) => {
  db.all('SELECT * FROM customers', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get a single customer by ID
const getCustomerById = (req, res) => {
  db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(row);
  });
};

// Create a new customer
const createCustomer = (req, res) => {
  const { name, email, phone, address, notes } = req.body;
  const id = require('../../utils/formatters').generateId();
  const now = new Date().toISOString();
  
  db.run(
    'INSERT INTO customers (id, name, email, phone, address, notes, totalSpent, totalOrders, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, email, phone, address, notes, 0, 0, now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
};

// Update a customer
const updateCustomer = (req, res) => {
  const { name, email, phone, address, notes } = req.body;
  const now = new Date().toISOString();
  
  db.run(
    'UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, notes = ?, updatedAt = ? WHERE id = ?',
    [name, email, phone, address, notes, now, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    }
  );
};

// Delete a customer
const deleteCustomer = (req, res) => {
  db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  });
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
