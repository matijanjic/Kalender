const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const testUtils = require('./test.utils');

const api = supertest(app);

const { initialUsers } = testUtils;

beforeEach(async () => {
  await testUtils.initUsers();
});

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all users are returned', async () => {
  const response = await api.get('/api/users');
  expect(response.body).toHaveLength(testUtils.initialUsers.length);
});

describe('getting a user by ID', () => {
  test('succedes with correct id', async () => {
    const user = await User.findOne({ username: initialUsers[0].username });

    await api
      .get(`/api/users/${user.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with status code 400 if incorrect id used', async () => {
    const wrongId = '123456789';
    await api
      .get(`/api/users/${wrongId}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('adding a user', () => {
  test('with correctly formatted data succeeds', async () => {
    const userToSave = {
      name: 'test_name',
      username: 'test_username',
      password: 'test_password',
    };

    await api
      .post('/api/users')
      .send(userToSave)
      .expect(200);
    const users = await testUtils.usersInDb();
    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(users.length);
  });
  test('with no user missing field fails with status code 400', async () => {
    const userToSave = {
      username: 'test_username',
      password: 'test_password',
    };

    await api
      .post('/api/users')
      .send(userToSave)
      .expect(400);
  });
  test('fails when username already taken', async () => {
    const user = testUtils.initialUsers[0];
    const result = await api
      .post('/api/users')
      .send(user)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');
  });
});

describe('deletion of a user', () => {
  test('succedes with status code 204 if id is valid', async () => {
    const usersAtStart = await testUtils.usersInDb();
    const userToDelete = usersAtStart[0];

    await api
      .delete(`/api/users/${userToDelete.id}`)
      .expect(204);

    const usersAtEnd = await testUtils.usersInDb();
    expect(usersAtEnd).toHaveLength(testUtils.initialUsers.length - 1);
  });
});

afterAll(() => {
  mongoose.disconnect();
});
