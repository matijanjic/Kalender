const router = require('express').Router();
const { getCalendars, createCalendar } = require('../controllers/calendars');

router.get('/', getCalendars);
router.post('/', createCalendar);

module.exports = router;
