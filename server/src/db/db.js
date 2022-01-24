/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const config = require('../utils/config');

// had to add following model imports because mongoose populate method would
// sometimes throw MissingSchemaError
const Calendar = require('../models/Calendar');
const User = require('../models/User');

const dbConnect = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('connected to MongoDB');
  } catch (error) {
    console.log('error connection to MongoDB:', error.message);
  }
};

module.exports = { dbConnect };
