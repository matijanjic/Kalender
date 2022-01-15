const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const User = require('../models/User');
require('dotenv').config();

const { SECRET } = process.env;

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    const error = createError(401, 'Wrong username or password');
    throw error;
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, SECRET);
  return { token, username: user.username, name: user.name };
};

module.exports = { loginUser };
