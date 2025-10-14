const request = require('supertest');
const path = require('path');
const app = require('../../app.js');

describe('Integration Test: Express App', () => {
  test('GET / should return login.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('<title>Login Page</title>');
  });

  test('GET /users should return valid JSON list', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('username', 'admin');
  });
});

