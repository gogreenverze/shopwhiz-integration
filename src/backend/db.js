
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database or open existing one
const dbPath = path.resolve(__dirname, '../../shopwhiz.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize the database with tables
function initializeDatabase() {
  db.serialize(() => {
    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      barcode TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`);

    // Customers table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      notes TEXT,
      totalSpent REAL NOT NULL,
      totalOrders INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )`);

    // Sales table
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      total REAL NOT NULL,
      tax REAL NOT NULL,
      grandTotal REAL NOT NULL,
      paymentMethod TEXT NOT NULL,
      status TEXT NOT NULL,
      customerId TEXT,
      customerName TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (customerId) REFERENCES customers (id)
    )`);

    // Sale items table
    db.run(`CREATE TABLE IF NOT EXISTS sale_items (
      id TEXT PRIMARY KEY,
      saleId TEXT NOT NULL,
      productId TEXT NOT NULL,
      productName TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unitPrice REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (saleId) REFERENCES sales (id),
      FOREIGN KEY (productId) REFERENCES products (id)
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL
    )`);

    // Insert default currency setting if not exists
    db.get(`SELECT value FROM settings WHERE key = 'currency'`, (err, row) => {
      if (!row) {
        db.run(`INSERT INTO settings (key, value) VALUES (?, ?)`, ['currency', 'USD']);
      }
    });

    // Check if we need to seed the database with initial data
    db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
      if (err) {
        console.error('Error checking products count:', err);
        return;
      }
      
      if (row.count === 0) {
        console.log('Seeding database with initial data...');
        seedDatabase();
      }
    });
  });
}

// Seed the database with initial data
function seedDatabase() {
  const { mockProducts, mockCustomers, mockSales } = require('../data/mockData');
  
  // Insert products
  const productStmt = db.prepare(`
    INSERT INTO products (id, name, description, price, stock, category, image, barcode, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  mockProducts.forEach(product => {
    productStmt.run(
      product.id,
      product.name,
      product.description,
      product.price,
      product.stock,
      product.category,
      product.image || null,
      product.barcode || null,
      product.createdAt.toISOString(),
      product.updatedAt.toISOString()
    );
  });
  
  productStmt.finalize();
  
  // Insert customers
  const customerStmt = db.prepare(`
    INSERT INTO customers (id, name, email, phone, address, notes, totalSpent, totalOrders, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  mockCustomers.forEach(customer => {
    customerStmt.run(
      customer.id,
      customer.name,
      customer.email,
      customer.phone,
      customer.address || null,
      customer.notes || null,
      customer.totalSpent,
      customer.totalOrders,
      customer.createdAt.toISOString(),
      customer.updatedAt.toISOString()
    );
  });
  
  customerStmt.finalize();
  
  // Insert sales and sale items
  mockSales.forEach(sale => {
    // Insert sale
    db.run(`
      INSERT INTO sales (id, total, tax, grandTotal, paymentMethod, status, customerId, customerName, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      sale.id,
      sale.total,
      sale.tax,
      sale.grandTotal,
      sale.paymentMethod,
      sale.status,
      sale.customerId || null,
      sale.customerName || null,
      sale.createdAt.toISOString()
    ], function(err) {
      if (err) {
        console.error('Error inserting sale:', err);
        return;
      }
      
      // Insert sale items
      const saleItemStmt = db.prepare(`
        INSERT INTO sale_items (id, saleId, productId, productName, quantity, unitPrice, total)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      sale.items.forEach((item, index) => {
        saleItemStmt.run(
          `${sale.id}-${index}`,
          sale.id,
          item.productId,
          item.productName,
          item.quantity,
          item.unitPrice,
          item.total
        );
      });
      
      saleItemStmt.finalize();
    });
  });
}

module.exports = db;
