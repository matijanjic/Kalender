const bcrypt = require('bcrypt');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.json(user);
};

// create a new user
const createUser = async (req, res) => {
  const { username, name, password } = req.body;
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
  res.json(savedUser.toJSON());
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(204).end();
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userFieldsToUpdate = req.body;
  const updatedUser = await User.findByIdAndUpdate(id, userFieldsToUpdate, { new: true });
  res.json(updatedUser);
};

module.exports = {
  getUser,
  createUser,
  deleteUser,
  updateUser,
};
