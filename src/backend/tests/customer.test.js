
const request = require('supertest');
const app = require('../server');
const db = require('../db');

describe('Customer API Tests', () => {
  let testCustomerId;

  beforeAll(async () => {
    // Ensure we have a clean database for testing
    await new Promise((resolve) => {
      db.run('DELETE FROM customers WHERE email = ?', ['test@example.com'], resolve);
    });
  });

  test('Should create a new customer', async () => {
    const response = await request(app)
      .post('/api/customers')
      .send({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '123-456-7890',
        address: '123 Test St',
        notes: 'Test notes'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Customer');
    expect(response.body.email).toBe('test@example.com');
    
    testCustomerId = response.body.id;
  });

  test('Should get all customers', async () => {
    const response = await request(app).get('/api/customers');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('Should get a customer by ID', async () => {
    if (!testCustomerId) {
      throw new Error('Test customer ID not set');
    }
    
    const response = await request(app).get(`/api/customers/${testCustomerId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testCustomerId);
    expect(response.body.name).toBe('Test Customer');
  });

  test('Should update a customer', async () => {
    if (!testCustomerId) {
      throw new Error('Test customer ID not set');
    }
    
    const response = await request(app)
      .put(`/api/customers/${testCustomerId}`)
      .send({
        name: 'Updated Test Customer',
        email: 'test@example.com',
        phone: '123-456-7890',
        address: '123 Test St',
        notes: 'Updated notes'
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', testCustomerId);
    expect(response.body.name).toBe('Updated Test Customer');
    expect(response.body.notes).toBe('Updated notes');
  });

  test('Should delete a customer', async () => {
    if (!testCustomerId) {
      throw new Error('Test customer ID not set');
    }
    
    const response = await request(app).delete(`/api/customers/${testCustomerId}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Customer deleted successfully');
    
    // Verify the customer was deleted
    const getResponse = await request(app).get(`/api/customers/${testCustomerId}`);
    expect(getResponse.statusCode).toBe(404);
  });
});
