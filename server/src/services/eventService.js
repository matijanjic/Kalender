const Event = require('../models/Event');

const getEvents = async () => {
  const events = await Event.find({}).populate(['creator', 'includes']);
  console.log(events);

  return events.map((event) => event.toJSON());
};

module.exports = {
  getEvents,
};
