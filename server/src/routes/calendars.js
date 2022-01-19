const router = require('express').Router();
const { getCalendars, createCalendar } = require('../services/calendarService');

router.get('/', async (req, res) => {
  const calendars = await getCalendars();
  console.log(calendars);
  res.json(calendars);
});

router.post('/', async (req, res) => {
  const calendar = req.body;
  const createdCalendar = await createCalendar(calendar);
  res.json(createdCalendar);
});

module.exports = router;
