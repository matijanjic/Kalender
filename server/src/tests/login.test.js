const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const testUtils = require('../utils/test.utils');

const api = supertest(app);

const { initialUsers } = testUtils;

beforeEach(async () => {
  await testUtils.initUsers();
});
describe('login of a user', () => {
  test('succeeds with correct credentials', async () => {
    const user = initialUsers[0];
    const userLogin = {
      username: user.username,
      password: user.password,
    };
    await api
      .post('/api/login')
      .send(userLogin)
      .expect(200);
  });
  test('fails with wrong credentials', async () => {
    const wrongCredentials = {
      username: 'wrongUsername',
      password: 'wrongPassword',
    };
    await api
      .post('/api/login')
      .send(wrongCredentials)
      .expect(401);
  });
});

afterAll(() => {
  mongoose.disconnect();
});
