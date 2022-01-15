const router = require('express').Router();
const { getEvents } = require('../services/eventService');

router.get('/', async (req, res) => {
  const events = await getEvents();
  res.json(events);
});

module.exports = router;
