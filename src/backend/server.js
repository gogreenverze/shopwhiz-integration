
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const settingsController = require('./controllers/settingsController');

// Import route handlers
const productsRoutes = require('./routes/products');
const customersRoutes = require('./routes/customers');
const salesRoutes = require('./routes/sales');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');
const reportsRoutes = require('./routes/reports');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoints
app.head('/api/settings/health', (req, res) => {
  res.status(200).end();
});

app.get('/api/settings/health', settingsController.healthCheck);

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reports', reportsRoutes);

module.exports = app;
