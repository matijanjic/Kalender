const router = require('express').Router();
const { getEvents, createEvent } = require('../services/eventService');

router.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});

router.post('/', async (req, res) => {
  const event = req.body;
  console.log(event);
  const createdEvent = await createEvent(event);
  res.json(createdEvent);
});

module.exports = router;
