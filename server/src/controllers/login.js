const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const createError = require('http-errors');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
require('dotenv').config();

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    throw ApiError.authorizationError('wrong username or password');
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  res.json({ token, username: user.username, name: user.name });
};

module.exports = { loginUser };
