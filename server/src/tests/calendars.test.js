const _ = require('lodash');
const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const testUtils = require('../utils/test.utils');
const Calendar = require('../models/Calendar');

const api = supertest(app);

// global auth variable for checking the logged in user
const auth = {};

beforeEach(async () => {
  // clear the db of users and calendars and add the predefined entries to it
  await testUtils.initUsers();
  await testUtils.initCalendars();
  // log one user in and store the token and id in the auth global object
  const response = await api.post('/api/login').send({
    username: 'username',
    password: 'password',
  });
  auth.token = `Bearer ${response.body.token}`;
  auth.currentUserId = jwt.verify(response.body.token, process.env.SECRET).id;
});

describe('returning multiple calendars', () => {
  test('returns them as json', async () => {
    await api
      .get('/api/calendars')
      .set('authorization', auth.token)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('returns only the users calendars', async () => {
    const response = await api
      .get('/api/calendars')
      .set('authorization', auth.token)
      .expect(200);

    const users = await testUtils.usersInDb();
    // check to see that only the users calendar is returned
    expect(JSON.stringify(response.body)).toContain(auth.currentUserId);
    expect(JSON.stringify(response.body)).not.toContain(users[1].id);
  });

  test('fails when user not logged in with 401', async () => {
    await api.get('/api/calendars').expect(401);
  });
});

describe('returning single calendar', () => {
  test('succeeds when logged in', async () => {
    const calendars = await testUtils.calendarsInDb();
    const response = await api
      .get(`/api/calendars/${calendars[0].id}`)
      .set('authorization', auth.token)
      .expect(200);
    expect(response.body).not.toBeInstanceOf(Array);
  });

  test('fails when not logged in with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    await api.get(`/api/calendars/${calendars[0]._id}`).expect(401);
  });

  test('fails when calendar not found with 404', async () => {
    const wrongId = '61f01296d9e3f52d245d00fe';
    await api
      .get(`/api/calendars/${wrongId}`)
      .set('authorization', auth.token)
      .expect(404);
  });
});

describe('adding a calendar', () => {
  test('succeeds when data correctly formatted', async () => {
    const calendarsAtStart = await testUtils.calendarsInDb();
    const calendar = {
      name: 'test_name',
    };
    const response = await api
      .post('/api/calendars')
      .set('authorization', auth.token)
      .send(calendar)
      .expect(200);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd).toHaveLength(calendarsAtStart.length + 1);
    expect(_.last(calendarsAtEnd).users).not.toEqual([]);
    expect(response.body.name).toBe('test_name');
  });

  test('adds the logged in user as the creator and the user', async () => {
    const calendar = {
      name: 'test_name',
    };
    await api
      .post('/api/calendars')
      .set('authorization', auth.token)
      .send(calendar)
      .expect(200);
    const calendars = await testUtils.calendarsInDb();

    expect(_.last(calendars).creator).toEqual(
      mongoose.Types.ObjectId(auth.currentUserId),
    );

    expect(_.last(calendars).users[0]).toEqual(
      mongoose.Types.ObjectId(auth.currentUserId),
    );
  });
});

describe('deleting a calendar', () => {
  test('succeeds when user logged in and deleting own calendar with 204', async () => {
    const calendars = await testUtils.calendarsInDb();
    await api
      .delete(`/api/calendars/${calendars[0].id}`)
      .set('authorization', auth.token)
      .expect(204);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd).toHaveLength(calendars.length - 1);
  });

  test('fails when not logged in with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    await api.delete(`/api/calendars/${calendars[0].id}`).expect(401);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd).toHaveLength(calendars.length);
  });

  test('fails when trying to delete an other users calendars with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    await api
      .delete(`/api/calendars/${calendars[1].id}`)
      .set('authorization', auth.token)
      .expect(401);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd).toHaveLength(calendars.length);
  });

  test('fails when trying to access nonexistent calendar with 404', async () => {
    const wrongId = '61f01296d9e3f52d245d00fe';

    await api
      .delete(`/api/calendars/${wrongId}`)
      .set('authorization', auth.token)
      .expect(404);
  });
});

describe('adding a user to a calendar', () => {
  test('succeeds when logged in and id provided', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const user = { id: users[2].id };

    await api
      .post(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .send(user)
      .expect(200);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(_.last(calendarsAtEnd[0].users).toString()).toBe(user.id);
  });

  test('fails when not logged in with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const user = { id: users[2].id };

    const response = await api
      .post(`/api/calendars/${calendarId}/users`)
      .send(user)
      .expect(401);

    expect(response.body).toContain('token missing');
  });

  test('fails when no id provided with 400', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;

    const response = await api
      .post(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .send({})
      .expect(400);
    expect(response.body).toContain('user id missing');
  });

  test('fails when calendar is not found with 404', async () => {
    const wrongId = '61f01296d9e3f52d245d00fe';
    const users = await testUtils.usersInDb();
    const user = { id: users[2].id };

    await api
      .post(`/api/calendars/${wrongId}/users`)
      .set('authorization', auth.token)
      .send(user)
      .expect(404);
  });

  test('fails when user is not found with 404', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const user = { id: '61f01296d9e3f52d245d00fe' };

    await api
      .post(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .send(user)
      .expect(404);
  });

  test('fails when user already added', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const user = { id: users[2].id };

    await api
      .post(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .send(user);

    await api
      .post(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .send(user)
      .expect(400);
  });

  test('fails when non creator attempts to add users', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[1].id;
    const users = await testUtils.usersInDb();
    const user = { id: users[2].id };

    await api
      .post(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .send(user)
      .expect(401);
  });
});

describe('removing a user from a calendar', () => {
  test('succeds when data correctly formatted with 202', async () => {
    const users = await testUtils.usersInDb();
    const calendars = await testUtils.calendarsInDb();
    const userId = users[3].id;
    const calendarId = calendars[0].id;

    await api
      .delete(`/api/calendars/${calendarId}/users/${userId}`)
      .set('authorization', auth.token)
      .expect(202);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].users).toHaveLength(calendars[0].users.length - 1);
    // also deletes the user from the events
    expect(calendarsAtEnd[0].events[0].toString()).not.toContain(userId);
  });

  // test removing another user when not logged in as creator 401
  test('fails when removing another user while not the calendar creator with 401', async () => {
    const users = await testUtils.usersInDb();
    const calendars = await testUtils.calendarsInDb();
    // another user
    const userId = users[3].id;
    // calendar that the logged user is not the creator of
    const calendarId = calendars[1].id;

    await api
      .delete(`/api/calendars/${calendarId}/users/${userId}`)
      .set('authorization', auth.token)
      .expect(401);
    // check to see that the user is not deleted
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[1].users).toHaveLength(calendars[1].users.length);
  });

  // test removing calendar creator, should fail with 400 bad request
  test('fails when trying to remove calendar creator from users array with 400', async () => {
    const users = await testUtils.usersInDb();
    const calendars = await testUtils.calendarsInDb();
    const userId = users[0].id;
    const calendarId = calendars[0].id;

    await api
      .delete(`/api/calendars/${calendarId}/users/${userId}`)
      .set('authorization', auth.token)
      .expect(400);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].users).toHaveLength(calendars[0].users.length);
  });
  // test removing when calendar or user not found 404
  test('fails when removing the user with user or calendar not found with 404', async () => {
    // wrong ids
    const userId = '61f011f4d9e3f52d245d00f1';
    const calendarId = '61f01296d9e3f52d245d00fe';

    await api
      .delete(`/api/calendars/${calendarId}/users/${userId}`)
      .set('authorization', auth.token)
      .expect(404);
  });

  test('fails when not logged in with 401', async () => {
    const users = await testUtils.usersInDb();
    const calendars = await testUtils.calendarsInDb();
    const userId = users[3].id;
    const calendarId = calendars[0].id;

    await api
      .delete(`/api/calendars/${calendarId}/users/${userId}`)
      .expect(401);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].users).toHaveLength(calendars[0].users.length);
  });
});

describe('adding an event', () => {
  test('succeeds with a logged in user at a calendar he is part of', async () => {
    const calendars = await testUtils.calendarsInDb();
    const event = {
      name: 'test_event',
      date: Date.now(),
    };
    await api
      .post(`/api/calendars/${calendars[0].id}/events`)
      .set('authorization', auth.token)
      .send(event)
      .expect(200);
  });

  test('fails with a logged in user at other users calendar with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const event = {
      name: 'test_event',
      date: Date.now(),
    };
    await api
      .post(`/api/calendars/${calendars[1].id}/events`)
      .set('authorization', auth.token)
      .send(event)
      .expect(401);
  });

  test('fails when not logged in with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const event = {
      name: 'test_event',
      date: Date.now(),
    };
    await api
      .post(`/api/calendars/${calendars[0].id}/events`)
      .send(event)
      .expect(401);
  });

  test('adds the logged user as a creator and user', async () => {
    const calendars = await testUtils.calendarsInDb();
    const event = {
      name: 'test_event',
      date: Date.now(),
    };
    await api
      .post(`/api/calendars/${calendars[0].id}/events`)
      .set('authorization', auth.token)
      .send(event)
      .expect(200);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].events[0].users.toString()).toContain(
      auth.currentUserId,
    );
  });

  test('fails when calendar is not found with 404', async () => {
    const wrongId = '61f01296d9e3f52d245d00fe';
    const event = {
      name: 'test_event',
      date: Date.now(),
    };
    await api
      .post(`/api/calendars/${wrongId}/events`)
      .set('authorization', auth.token)
      .send(event)
      .expect(404);
  });
});

describe('updating an event', () => {
  test('succeeds when logged in and both name and event provided', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const eventId = _.last(calendars[0].events)._id.toString();
    const eventUpdate = {
      name: 'updated_name',
      date: Date.now(),
    };
    const response = await api
      .patch(`/api/calendars/${calendarId}/events/${eventId}`)
      .set('authorization', auth.token)
      .send(eventUpdate)
      .expect(200);
    expect(response.body.name).toBe('updated_name');
  });

  test('succeeds when logged in and only one argument given to update', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const eventId = _.last(calendars[0].events)._id.toString();
    const eventUpdate = {
      name: 'updated_name',
    };
    const response = await api
      .patch(`/api/calendars/${calendarId}/events/${eventId}`)
      .set('authorization', auth.token)
      .send(eventUpdate)
      .expect(200);
    expect(response.body.name).toBe('updated_name');
  });

  test('does not succeed when not logged in with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const eventId = _.last(calendars[0].events)._id.toString();
    const eventUpdate = {
      name: 'updated_name',
      date: Date.now(),
    };
    await api
      .patch(`/api/calendars/${calendarId}/events/${eventId}`)
      .send(eventUpdate)
      .expect(401);
  });

  test('fails when no date or name given with 400', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const eventId = _.last(calendars[0].events)._id.toString();
    const response = await api
      .patch(`/api/calendars/${calendarId}/events/${eventId}`)
      .set('authorization', auth.token)
      .send({})
      .expect(400);
    expect(response.body.toString()).toContain('error');
  });

  test('fails when calendar or event not found with 404', async () => {
    const calendarId = '61f01296d9e3f52d245d00fe';
    const eventId = '61f012a9d9e3f52d245d0102';
    const eventUpdate = {
      name: 'updated_name',
      date: Date.now(),
    };
    await api
      .patch(`/api/calendars/${calendarId}/events/${eventId}`)
      .set('authorization', auth.token)
      .send(eventUpdate)
      .expect(404);
  });
});

describe('removing an event', () => {
  test('succeeds when logged user is the calendar or event creator with 204', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const eventId = calendars[0].events[0]._id.toString();

    await api
      .delete(`/api/calendars/${calendarId}/events/${eventId}`)
      .set('authorization', auth.token)
      .expect(204);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].events).toHaveLength(
      calendars[0].events.length - 1,
    );
  });

  test('fails when user is not the creator with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[1].id;
    const eventId = calendars[1].events[0]._id.toString();

    await api
      .delete(`/api/calendars/${calendarId}/events/${eventId}`)
      .set('authorization', auth.token)
      .expect(401);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[1].events).toHaveLength(calendars[1].events.length);
  });

  test('fails when calendar or event is not found with 404', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = '61f01296d9e3f52d245d00fe';
    const eventId = '61f012a9d9e3f52d245d0102';

    await api
      .delete(`/api/calendars/${calendarId}/events/${eventId}`)
      .set('authorization', auth.token)
      .expect(404);

    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].events).toHaveLength(calendars[0].events.length);
  });
});

describe('adding a user to an event', () => {
  test('succeeds with correct data and logged user', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const userId = users[2].id;
    const eventId = calendars[0].events[0]._id.toString();
    const calendar = await Calendar.findById(calendarId);
    calendar.users.push(userId);
    await calendar.save();

    await api
      .post(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ id: userId })
      .expect(200);
  });

  test('fails when not logged in with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const userId = users[2].id;
    const eventId = calendars[0].events[0]._id.toString();

    await api
      .post(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .send({ id: userId })
      .expect(401);
  });

  test('fails when user, event or calendar not found with 404', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const userId = users[2].id;
    const eventId = calendars[0].events[0]._id.toString();
    const wrongId = '61f011f4d9e3f52d245d00f1';

    await api
      .post(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ id: wrongId })
      .expect(404);

    await api
      .post(`/api/calendars/${wrongId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ id: userId })
      .expect(404);

    await api
      .post(`/api/calendars/${calendarId}/events/${wrongId}/users`)
      .set('authorization', auth.token)
      .send({ id: userId })
      .expect(404);
  });

  test('fails if user already added with 400', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const userId = users[2].id;
    const eventId = calendars[0].events[0]._id.toString();
    const calendar = await Calendar.findById(calendarId);
    calendar.users.push(userId);
    await calendar.save();

    await api
      .post(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ id: userId })
      .expect(200);
    await api
      .post(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ id: userId })
      .expect(400);
  });

  test('fails when user is not part of calendar users', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const users = await testUtils.usersInDb();
    const userId = users[2].id;
    const eventId = calendars[0].events[0]._id.toString();

    await api
      .post(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ id: userId })
      .expect(401);
  });
});

describe('removing a user from an event', () => {
  test('succeeds when the logged in user is the creator', async () => {
    const calendars = await testUtils.calendarsInDb();
    const users = await testUtils.usersInDb();
    const calendarId = calendars[0].id;
    const eventId = calendars[0].events[0]._id.toString();
    const userId = users[3].id;

    await api
      .delete(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ userId })
      .expect(204);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].events[0].users.toString()).not.toContain(userId);
  });

  test('fails when the logged in user is not the creator with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const users = await testUtils.usersInDb();
    const calendarId = calendars[1].id;
    const eventId = calendars[1].events[0]._id.toString();
    const userId = users[3].id;

    await api
      .delete(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ userId })
      .expect(401);
  });

  test('fails when the trying to remove the creator with 400', async () => {
    const calendars = await testUtils.calendarsInDb();
    const users = await testUtils.usersInDb();
    const calendarId = calendars[0].id;
    const eventId = calendars[0].events[0]._id.toString();
    const userId = users[0].id;

    await api
      .delete(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ userId })
      .expect(400);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].events[0].users.toString()).toContain(userId);
  });

  test('fails when event or calendar not found with 404', async () => {
    const users = await testUtils.usersInDb();
    const calendarId = '61f01296d9e3f52d245d00fe';
    const eventId = '61f012a9d9e3f52d245d0102';
    const userId = users[0].id;

    await api
      .delete(`/api/calendars/${calendarId}/events/${eventId}/users`)
      .set('authorization', auth.token)
      .send({ userId })
      .expect(404);
    const calendarsAtEnd = await testUtils.calendarsInDb();
    expect(calendarsAtEnd[0].events[0].users.toString()).toContain(userId);
  });
});

describe('getting users', () => {
  test('succeeds when logged user is in the users list and returns them as json', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const response = await api
      .get(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .expect('Content-Type', /application\/json/)
      .expect(200);
    expect(calendars[0].users).toHaveLength(response.body.length);
    console.log(response.body);
    expect(response.body[0]).toHaveProperty('name');
  });

  test('fails when user is not in the users list with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[1].id;
    await api
      .get(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .expect(401);
  });

  test('fails when calendar not found 404', async () => {
    const calendarId = '61f01296d9e3f52d245d00fe';
    await api
      .get(`/api/calendars/${calendarId}/users`)
      .set('authorization', auth.token)
      .expect(404);
  });
});

describe('getting events', () => {
  test('succeeds when logged in and user in calendar', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[0].id;
    const response = await api
      .get(`/api/calendars/${calendarId}/events`)
      .set('authorization', auth.token)
      .expect('Content-Type', /application\/json/)
      .expect(200);
    expect(calendars[0].events).toHaveLength(response.body.length);
    expect(response.body[0]).toHaveProperty('name');
  });

  test('fails when user not part of the calendar with 401', async () => {
    const calendars = await testUtils.calendarsInDb();
    const calendarId = calendars[1].id;
    await api
      .get(`/api/calendars/${calendarId}/events`)
      .set('authorization', auth.token)
      .expect('Content-Type', /application\/json/)
      .expect(401);
  });

  test('fails when calendar not found with 404', async () => {
    const calendarId = '61f01296d9e3f52d245d00fe';
    await api
      .get(`/api/calendars/${calendarId}/events`)
      .set('authorization', auth.token)
      .expect('Content-Type', /application\/json/)
      .expect(404);
  });
});

afterAll(() => {
  mongoose.disconnect();
});
