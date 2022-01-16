const Event = require('../models/Event');

const getEvents = async () => {
  const events = await Event.find({}).populate(['creator', 'includes']);
  console.log('getEvents', events);

  return events;
};

const createEvent = async (event) => {
  console.log('createEvent', event);
  const eventToSave = new Event(event);
  const savedEvent = await eventToSave.save();
  return savedEvent;
};

module.exports = {
  getEvents,
  createEvent,
};
