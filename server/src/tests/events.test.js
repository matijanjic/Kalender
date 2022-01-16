const mongoose = require('mongoose');
const supertest = require('supertest');
const { inspect } = require('util');
const app = require('../app');
const testUtils = require('../utils/test.utils');

const api = supertest(app);

beforeEach(async () => {
  await testUtils.initEvents();
});

describe('events are returned', () => {
  test('events are returned as json', async () => {
    const events = await api
      .get('/api/events')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    console.log(inspect(events.body, { depth: null }));
  });

  test('all events are returned', async () => {
    const response = await api.get('/api/events');
    expect(response.body).toHaveLength(testUtils.initialEvents.length);
  });
});

describe('adding events', () => {
  test('succeeds with correct formatting', async () => {
    const users = await testUtils.usersInDb();
    const creatorId = users[0].id;
    const includesIds = [users[0].id, users[1].id];
    const event = {
      name: 'Test event',
      date: new Date(2022, 2, 2, 2),
      creator: creatorId,
      includes: includesIds,
    };
    console.log(event);
    await api
      .post('/api/events')
      .send(event)
      .expect(200);
  });
});

afterAll(() => {
  mongoose.disconnect();
});
