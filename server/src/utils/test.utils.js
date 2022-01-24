/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Calendar = require('../models/Calendar');

const initialUsers = [
  {
    username: 'username',
    name: 'name',
    password: 'password',
  },
  {
    username: 'username1',
    name: 'name1',
    password: 'password1',
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

const initCalendars = async () => {
  await Calendar.deleteMany({});
  const users = await usersInDb();

  for (const [i, calendar] of initialCalendars.entries()) {
    calendar.creator = users[i].id;
    calendar.users = [users[i].id];
    calendar.events = [initialEvents[i]];
    calendar.events[0].creator = users[i].id;
    calendar.events[0].users = [users[i].id];
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
  initialEvents,
  initCalendars,
  calendarsInDb,
  initialCalendars,
};
