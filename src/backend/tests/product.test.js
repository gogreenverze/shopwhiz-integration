
const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Product API Tests', () => {
  let testProductId;

  beforeAll(async () => {
    // Ensure we have a clean database for testing
    await new Promise((resolve) => {
      db.run('DELETE FROM products WHERE name = ?', ['Test Product'], resolve);
    });
  });

  test('Should create a new product', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        description: 'Test description',
        price: 9.99,
        stock: 100,
        category: 'Test Category',
        barcode: '12345678'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Product');
    expect(response.body.price).toBe(9.99);
    
    testProductId = response.body.id;
  });

  test('Should get all products', async () => {
    const response = await request(app).get('/api/products');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('Should get a product by ID', async () => {
    if (!testProductId) {
      throw new Error('Test product ID not set');
    }
    
    const response = await request(app).get(`/api/products/${testProductId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testProductId);
    expect(response.body.name).toBe('Test Product');
  });

  test('Should update a product', async () => {
    if (!testProductId) {
      throw new Error('Test product ID not set');
    }
    
    const response = await request(app)
      .put(`/api/products/${testProductId}`)
      .send({
        name: 'Updated Test Product',
        description: 'Updated description',
        price: 19.99,
        stock: 50,
        category: 'Test Category',
        barcode: '12345678'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testProductId);
    expect(response.body.name).toBe('Updated Test Product');
    expect(response.body.price).toBe(19.99);
    expect(response.body.stock).toBe(50);
  });

  test('Should delete a product', async () => {
    if (!testProductId) {
      throw new Error('Test product ID not set');
    }
    
    const response = await request(app).delete(`/api/products/${testProductId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Product deleted successfully');
    
    // Verify the product was deleted
    const getResponse = await request(app).get(`/api/products/${testProductId}`);
    expect(getResponse.statusCode).toBe(404);
  });
});
