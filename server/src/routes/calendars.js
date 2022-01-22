const router = require('express').Router({ mergeParams: true });
const { getCalendars, createCalendar } = require('../controllers/calendars');

router.get('/', getCalendars);
router.post('/', createCalendar);

module.exports = router;
