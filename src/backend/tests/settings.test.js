
const request = require('supertest');
const app = require('../server');

describe('Settings API Tests', () => {
  test('Should get currency setting', async () => {
    const response = await request(app).get('/api/settings/currency');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('currency');
  });

  test('Should update currency setting', async () => {
    const response = await request(app)
      .put('/api/settings/currency')
      .send({ currency: 'EUR' });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('currency', 'EUR');
    
    // Verify the setting was updated
    const getResponse = await request(app).get('/api/settings/currency');
    expect(getResponse.body.currency).toBe('EUR');
    
    // Reset to USD for other tests
    await request(app).put('/api/settings/currency').send({ currency: 'USD' });
  });

  test('Should return OK for health check', async () => {
    const response = await request(app).get('/api/settings/health');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
