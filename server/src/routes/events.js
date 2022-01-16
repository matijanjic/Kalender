const router = require('express').Router();
const { getEvents, createEvent, updateEvent } = require('../services/eventService');

router.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});

router.post('/', async (req, res) => {
  const event = req.body;
  const createdEvent = await createEvent(event);
  res.json(createdEvent);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const eventFieldsToUpdate = req.body;
  console.log(eventFieldsToUpdate);
  const updatedEvent = await updateEvent(id, eventFieldsToUpdate);
  res.json(updatedEvent);
});

module.exports = router;
