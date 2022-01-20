/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Event = require('../models/Event');
const Calendar = require('../models/Calendar');

const initialUsers = [
  {
    username: 'JohnDoe',
    name: 'John',
    password: 'password123',
  },
  {
    username: 'MaryJane',
    name: 'Mary Jane',
    password: '321password',
  },
];

const initialEvents = [
  {
    name: 'Small get-together',
    date: new Date(2022, 4, 21, 22, 0),
  },
  {
    name: 'Birthday party',
    date: new Date(2022, 0, 2, 20, 0),
  },
];

const initialCalendars = [
  {
    name: 'test_calendar1',
  },
  {
    name: 'test_calendar2',
  },
];

const initUsers = async () => {
  await User.deleteMany({});

  for (const user of initialUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const hashedUser = {
      name: user.name,
      username: user.username,
      passwordHash: hashedPassword,
    };
    const userToSave = new User(hashedUser);
    await userToSave.save();
  }
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const initEvents = async () => {
  await initUsers();
  await Event.deleteMany({});
  const users = await User.find({});
  for (const event of initialEvents) {
    event.creator = users[0]._id;
    event.includes = [users[0]._id, users[1]._id];
    const eventToSave = new Event(event);
    await eventToSave.save();
  }
};

const eventsInDb = async () => {
  const events = await Event.find({});
  return events.map((event) => event.toJSON());
};

const initCalendars = async () => {
  await Calendar.deleteMany({});
  await initEvents();
  const events = await eventsInDb();
  const users = await usersInDb();

  for (const calendar of initialCalendars) {
    calendar.creator = users[0].id;
    calendar.users = [users[0].id, users[1].id];
    calendar.events = [events[0].id, events[1].id];
    const calendarToSave = new Calendar(calendar);
    await calendarToSave.save();
  }
};

const calendarsInDb = async () => {
  const calendars = await Calendar.find({});
  return calendars;
};

module.exports = {
  initialUsers,
  initUsers,
  usersInDb,
  initEvents,
  initialEvents,
  eventsInDb,
  initCalendars,
  calendarsInDb,
  initialCalendars,
};
