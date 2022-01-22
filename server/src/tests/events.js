const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const app = require('../app');
const testUtils = require('../utils/test.utils');

const api = supertest(app);

beforeEach(async () => {
  await testUtils.initEvents();
});

describe('events are returned', () => {
  test('events are returned as json', async () => {
    await api
      .get('/api/events')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all events are returned', async () => {
    const response = await api.get('/api/events');
    expect(response.body).toHaveLength(testUtils.initialEvents.length);
  });
});

describe('adding events', () => {
  test('succeeds with correct formatting', async () => {
    const users = await testUtils.usersInDb();
    const eventsAtStart = await testUtils.eventsInDb();
    const event = {
      name: 'Test event',
      date: new Date(2022, 2, 2, 2),
      creator: users[0].id,
      includes: [users[0].id, users[1].id],
    };
    await api
      .post('/api/events')
      .send(event)
      .expect(200);
    const eventsAtEnd = await testUtils.eventsInDb();
    expect(eventsAtEnd).toHaveLength(eventsAtStart.length + 1);
  });

  test('fails with missing data', async () => {
    const malformattedEvent = {
      name: 'Test event',
      date: new Date(2022, 2, 2, 2),
    };
    await api
      .post('/api/events')
      .send(malformattedEvent)
      .expect(400);

    const result = await api.post('/api/events').send(malformattedEvent);
    expect(result.body.error).toContain('validation failed');
  });
});

test('Updating an event field works', async () => {
  const eventsAtStart = await testUtils.eventsInDb();
  const { id } = eventsAtStart[0];
  const updatedField = {
    name: 'updated name',
  };

  await api
    .patch(`/api/events/${id}`)
    .send(updatedField)
    .expect(200);
  const eventsAtEnd = await testUtils.eventsInDb();

  expect(eventsAtEnd[0].name).toBe('updated name');
});

afterAll(() => {
  mongoose.disconnect();
});