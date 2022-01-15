const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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
  includes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

eventSchema.plugin(uniqueValidator);

eventSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
