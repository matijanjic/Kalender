const mongoose = require('mongoose');
const supertest = require('supertest');
const { inspect } = require('util');
const app = require('../app');
const testUtils = require('./test.utils');

const api = supertest(app);

beforeEach(async () => {
  await testUtils.initEvents();
});

test.only('events are returned as json', async () => {
  const events = await api
    .get('/api/events')
    .expect(200)
    .expect('Content-Type', /application\/json/);
  console.log(inspect(events.body, { depth: null }));
});

afterAll(() => {
  mongoose.disconnect();
});
