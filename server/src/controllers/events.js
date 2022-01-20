const Event = require('../models/Event');

const getEvents = async (req, res) => {
  console.log(req.params.id);

  const events = await Event.find({}).populate({
    path: 'creator',
    select: 'name',
    match: { _id: req.params.id },
  })
    .populate('includes', { name: 1 });
  res.send(events.map((event) => event.toJSON()));
};

const createEvent = async (req, res) => {
  const event = req.body;
  const eventToSave = new Event(event);
  const savedEvent = await eventToSave.save();
  res.send(savedEvent.toJSON());
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const eventFieldsToUpdate = req.body;
  const updatedEvent = await Event.findByIdAndUpdate(id, eventFieldsToUpdate, { new: true });
  res.send(updatedEvent.toJSON());
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
};
