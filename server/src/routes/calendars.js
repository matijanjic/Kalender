const router = require('express').Router({ mergeParams: true });
const {
  getCalendars,
  createCalendar,
  getCalendar,
  addEvent,
  addUser,
  addEventUser,
  removeEventUser,
  updateEvent,
  removeEvent,
  getUsers,
  getEvents,
  removeCalendar,
  removeUser,
} = require('../controllers/calendars');

router.route('/')
  .get(getCalendars)
  .post(createCalendar);

router.route('/:calendarId')
  .get(getCalendar)
  .delete(removeCalendar);

router.route('/:calendarId/users')
  .get(getUsers)
  .post(addUser);

router.route('/:calendarId/users/:userId')
  .delete(removeUser);

router.route('/:calendarId/events')
  .get(getEvents)
  .post(addEvent);

router.route('/:calendarId/events/:eventId/users')
  .post(addEventUser)
  .delete(removeEventUser);

router.route('/:calendarId/events/:eventId')
  .patch(updateEvent)
  .delete(removeEvent);

module.exports = router;
