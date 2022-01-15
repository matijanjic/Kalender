/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Event = require('../models/Event');

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

  const event = initialEvents[0];
  event.creator = users[0]._id;
  event.includes = [users[0]._id, users[1]._id];
  const eventToSave = new Event(event);
  await eventToSave.save();
};

module.exports = {
  initialUsers,
  initUsers,
  usersInDb,
  initEvents,
  initialEvents,
};
