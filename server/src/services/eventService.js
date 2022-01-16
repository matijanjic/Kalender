const Event = require('../models/Event');

const getEvents = async () => {
  const events = await Event.find({}).populate(['creator', 'includes']);
  return events;
};

const createEvent = async (event) => {
  const eventToSave = new Event(event);
  const savedEvent = await eventToSave.save();
  return savedEvent;
};

const updateEvent = async (id, eventFieldsToUpdate) => {
  const updatedEvent = await Event.findByIdAndUpdate(id, eventFieldsToUpdate, { new: true });
  return updatedEvent;
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
};
