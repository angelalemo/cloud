
const request = require('supertest');
const app = require('../../server'); 
describe('Login Success', () => {
  test('POST /login with correct credentials should redirect to /home', async () => {

    const response = await request(app)
      .post('/login')
      .send({ username: 'admin', password: '1234' });


    expect(response.statusCode).toBe(302);

    expect(response.headers.location).toBe('/home');
  });
});
