const mongoose = require('mongoose');
const config = require('../utils/config');

const dbConnect = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('connected to MongoDB');
  } catch (error) {
    console.log('error connection to MongoDB:', error.message);
  }
};

module.exports = { dbConnect };
