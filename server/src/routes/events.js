const router = require('express').Router({ mergeParams: true });
const { getEvents, createEvent, updateEvent } = require('../controllers/events');

router.get('/', getEvents);
router.post('/', createEvent);
router.patch('/:id', updateEvent);

module.exports = router;
