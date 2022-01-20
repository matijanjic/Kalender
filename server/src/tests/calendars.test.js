const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const testUtils = require('../utils/test.utils');

const api = supertest(app);

beforeEach(async () => {
  await testUtils.initCalendars();
});

describe('calendars are returned', () => {
  test('calendars are returned as json', async () => {
    await api
      .get('/api/calendars')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all calendars are returned', async () => {
    const response = await api.get('/api/events');
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
