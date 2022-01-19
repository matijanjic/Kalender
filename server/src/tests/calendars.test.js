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

afterAll(() => {
  mongoose.disconnect();
});
