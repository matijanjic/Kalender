const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
const testUtils = require('../utils/test.utils');

const api = supertest(app);

const auth = {};

beforeEach(async () => {
  // clear the db of users and add the predefined users to it
  await testUtils.initUsers();
  // log one user in and store the token and id in the auth global object
  const response = await api
    .post('/api/login')
    .send({
      username: 'username',
      password: 'password',
    });
  auth.token = `Bearer ${response.body.token}`;
  auth.currentUserId = jwt.verify(response.body.token, process.env.SECRET).id;
});

describe('getting a user by ID', () => {
  test('succedes when requesting user info of a currently logged in user', async () => {
    const user = await User.findById(auth.currentUserId);

    await api
      .get(`/api/users/${user.id}`)
      .set('authorization', auth.token)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with status code 401 Unauthorized if any other id is used', async () => {
    const wrongUser = await User.findOne({ username: 'username1' });
    const wrongId = wrongUser._id.toString();
    await api
      .get(`/api/users/${wrongId}`)
      .set('authorization', auth.token)
      .expect(401)
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
    expect(users).toHaveLength(testUtils.initialUsers.length + 1);
  });

  test('with missing field fails with status code 400', async () => {
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

  test('fails when password is malformed', async () => {
    const user = {
      name: 'test_name',
      username: 'test_username',
      password: 'foo',
    };
    await api
      .post('/api/users')
      .send(user)
      .expect(400);
  });
});

describe('deletion of a user', () => {
  test('succedes with status code 204 if id is valid', async () => {
    const usersAtStart = await testUtils.usersInDb();
    const userToDelete = usersAtStart[0];

    await api
      .delete(`/api/users/${userToDelete.id}`)
      .set('authorization', auth.token)
      .expect(204);

    const usersAtEnd = await testUtils.usersInDb();
    expect(usersAtEnd).toHaveLength(testUtils.initialUsers.length - 1);
  });
});

describe('updating user info', () => {
  test('Succeds with correct fields', async () => {
    const usersAtStart = await testUtils.usersInDb();
    const userToChange = usersAtStart[0];

    const result = await api
      .patch(`/api/users/${userToChange.id}`)
      .set('authorization', auth.token)
      .send({ name: 'JaneDoe' })
      .expect(200);

    expect(userToChange.name).not.toBe(result.body.name);
    expect(result.body.name).toBe('JaneDoe');
  });
});

afterAll(() => {
  mongoose.disconnect();
});
