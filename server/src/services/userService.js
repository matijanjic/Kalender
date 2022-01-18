const bcrypt = require('bcrypt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// get all users
const getUsers = async () => {
  const users = await User.find({}).populate();
  return users;
};

const getUser = async (id) => {
  const user = await User.findById(id);
  return user;
};

// create a new user
const createUser = async ({ name, username, password }) => {
  // password length check
  if (!password || password.length < 6) {
    throw ApiError.badRequest('password must be at least 6 characters long');
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

const updateUser = async (id, userFieldsToUpdate) => {
  const updatedUser = await User.findByIdAndUpdate(id, userFieldsToUpdate, { new: true });
  return updatedUser;
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
