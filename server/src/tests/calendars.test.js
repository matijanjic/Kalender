const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const testUtils = require('../utils/test.utils');

const api = supertest(app);

// global auth variable for checking the logged in user
const auth = {};

beforeEach(async () => {
  // clear the db of users and calendars and add the predefined entries to it
  await testUtils.initUsers();
  await testUtils.initCalendars();
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

describe('returning calendars', () => {
  test('calendars are returned as json', async () => {
    await api
      .get('/api/calendars')
      .set('authorization', auth.token)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('only calendars of the user are returned', async () => {
    const response = await api
      .get('/api/calendars')
      .set('authorization', auth.token);
    console.log(response.body);
    expect(response.body).toHaveLength(testUtils.initialEvents.length);
  });
});

describe('adding calendars', () => {
  test('succeeds when data correctly formatted', async () => {
    const users = await testUtils.usersInDb();
    const events = await testUtils.eventsInDb();
    const calendarsAtStart = await testUtils.calendarsInDb();
    const calendar = {
      name: 'test_name',
      creator: users[0].id,
      events: [events[0].id, events[1].id],
      users: [users[0].id, users[1].id],
    };
    await api
      .post('/api/calendars')
      .send(calendar)
      .expect(200);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    console.log(calendarsAtEnd);

    expect(calendarsAtEnd).toHaveLength(calendarsAtStart.length + 1);
  });
});

afterAll(() => {
  mongoose.disconnect();
});
