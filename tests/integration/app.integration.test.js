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

  test('POST /users should add a new admin user', async () => {
    const newUser = { id: '2', adminusername: 'newadmin', adminpassword: 'newpass' };
    const res = await request(app).post('/users').send(newUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);

    const getRes = await request(app).get('/users');
    const addedUser = getRes.body.find(user => user.adminusername === 'newadmin');
    expect(addedUser).toBeDefined();
    expect(addedUser).toHaveProperty('adminpassword', 'newpass');
  });
});

