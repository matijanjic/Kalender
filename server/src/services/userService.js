const bcrypt = require('bcrypt');
const User = require('../models/User');

// get all users
const getUsers = async () => {
  const users = await User.find({}).populate();
  return users;
};

const getUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// create a new user
const createUser = async ({ name, username, password }) => {
  // password length check
  if (!password || password.length < 3) {
    throw new Error('Password must be at least 3 characters long');
  }

  // hashing the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return savedUser;
};

const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  deleteUser,
};
