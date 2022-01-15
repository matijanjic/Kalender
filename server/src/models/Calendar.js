const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
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
