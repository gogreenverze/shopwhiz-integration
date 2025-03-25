
const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Sale API Tests', () => {
  let testProductId;
  let testSaleId;

  // Setup - create a test product
  beforeAll(async () => {
    const productResponse = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Sale Product',
        description: 'Product for sale test',
        price: 29.99,
        stock: 100,
        category: 'Test Category',
        barcode: '87654321'
      });
    
    testProductId = productResponse.body.id;
  });

  // Cleanup
  afterAll(async () => {
    if (testProductId) {
      await request(app).delete(`/api/products/${testProductId}`);
    }
  });

  test('Should create a new sale', async () => {
    if (!testProductId) {
      throw new Error('Test product ID not set');
    }

    const response = await request(app)
      .post('/api/sales')
      .send({
        items: [
          {
            productId: testProductId,
            productName: 'Test Sale Product',
            quantity: 2,
            unitPrice: 29.99,
            total: 59.98
          }
        ],
        total: 59.98,
        tax: 5.99,
        grandTotal: 65.97,
        paymentMethod: 'cash',
        status: 'completed'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('items');
    expect(response.body.items.length).toBe(1);
    expect(response.body.total).toBe(59.98);
    expect(response.body.grandTotal).toBe(65.97);
    
    testSaleId = response.body.id;
  });

  test('Should get all sales', async () => {
    const response = await request(app).get('/api/sales');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('Should get a sale by ID', async () => {
    if (!testSaleId) {
      throw new Error('Test sale ID not set');
    }
    
    const response = await request(app).get(`/api/sales/${testSaleId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testSaleId);
    expect(response.body).toHaveProperty('items');
    expect(response.body.items.length).toBe(1);
  });
});
