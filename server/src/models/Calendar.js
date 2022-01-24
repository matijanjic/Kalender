const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

const calendarSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  events: [eventSchema],
});

calendarSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar;
