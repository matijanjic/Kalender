const _ = require('lodash');
const Calendar = require('../models/Calendar');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// returns all the calendars of the logged in user
const getCalendars = async (req, res) => {
  const { user } = req;

  const calendars = await Calendar.find({ users: user._id });
  console.log(calendars);

  res.json(calendars);
};

// creates a new calendar
const createCalendar = async (req, res) => {
  const calendar = req.body;

  // req.user available because of the extractUser middleware in the app.js
  calendar.creator = req.user.id;
  calendar.users = calendar.users
    ? calendar.users.concat(req.user.id)
    : [req.user.id];
  const calendarToSave = new Calendar(calendar);
  const savedCalendar = await calendarToSave.save();
  res.json(savedCalendar);
};

// removes a calendar if the current user is the creator
const removeCalendar = async (req, res) => {
  const { calendarId } = req.params;
  const calendar = await Calendar.findById(calendarId);

  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }

  if (calendar.creator.toString() === req.user.id) {
    await calendar.remove();
    res.status(204).end();
  } else {
    throw ApiError.authorizationError(
      "you don't have permission to delete this calendar",
    );
  }
};

// TODO add an update calendar function for changing the name

// gets a specific calendar
const getCalendar = async (req, res) => {
  const { calendarId } = req.params;
  const calendar = await Calendar.findById(calendarId).populate('users');

  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  res.json(calendar);
};

// adds an event to the array of event subdocuments in the calendar
const addEvent = async (req, res) => {
  const { calendarId } = req.params;
  const event = req.body;
  event.creator = req.user.id;
  event.users = event.users ? [...event.users, req.user.id] : [req.user.id];
  event.users = Array.from(new Set([...event.users]));
  // find the calendar and add the event to it
  const calendar = await Calendar.findById(calendarId);
  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  if (!calendar.users.includes(req.user.id)) {
    throw ApiError.authorizationError(
      'can not add events to calendars user is not part of',
    );
  }
  calendar.events.push(event);
  // adds all event users to the calendar users and removes duplicates
  calendar.users = [
    ...new Set([...calendar.users, ...event.users].map((u) => u.toString())),
  ];
  const savedCalendar = await calendar.save();

  res.json(_.last(savedCalendar.events));
};

// adds a user to the calendar users list
const addUser = async (req, res) => {
  const { calendarId } = req.params;
  const userId = req.body.id;

  if (!userId) throw ApiError.badRequest('user id missing');
  const calendar = await Calendar.findById(calendarId);

  const user = await User.findById(userId);

  if (!user) throw ApiError.notFound('user not found');
  if (!calendar) throw ApiError.notFound('calendar not found.');
  if (!calendar.creator.equals(req.user.id)) {
    throw ApiError.authorizationError('only the creator can add users');
  }
  // checks to see if user is already added
  if (!calendar.users.includes(userId)) {
    calendar.users.push(userId);
    await calendar.save();
    res.status(200).end();
  } else {
    throw ApiError.badRequest("can't add user, user already added.");
  }
};

// removes a user from the calendar users, but not if the user is the creator
// also removes the user from the events
const removeUser = async (req, res) => {
  const { calendarId, userId } = req.params;

  const calendar = await Calendar.findById(calendarId);
  if (!calendar) throw ApiError.notFound('calendar not found.');

  const userFound = calendar.users.some((user) => user.equals(userId));
  if (!userFound) throw ApiError.notFound('user not found.');

  if (calendar.creator.equals(userId)) {
    throw ApiError.badRequest(
      'can not remove calendar creator from the users list',
    );
  }
  if (!calendar.creator.equals(req.user.id) && !(userId === req.user.id)) {
    throw ApiError.authorizationError(
      'only the creator can remove other users.',
    );
  }
  calendar.events.forEach((event) => {
    event.users.pull(userId);
  });
  calendar.users.pull(userId);
  await calendar.save();
  res.status(202).end();
};

// adds a user to the event subdocument inside a calendar
const addEventUser = async (req, res) => {
  const userId = req.body.id;
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar?.events?.id(eventId);
  const user = await User.findById(userId);

  if (!calendar || !event || !user) {
    throw ApiError.notFound('calendar, event or user not found.');
  }
  if (!calendar.users.includes(userId)) {
    throw ApiError.authorizationError(
      "user can't be added to event, user not part of calendar users.",
    );
  }
  // checks to see if user is already added
  if (!event.users.includes(userId)) {
    event.users.push(userId);
    await calendar.save();
    res.status(200).end();
  } else {
    throw ApiError.badRequest("can't add user, user already exists.");
  }
};

// removes a user from the event
const removeEventUser = async (req, res) => {
  const { userId } = req.body;
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar?.events?.id(eventId);

  if (!calendar || !event) {
    throw ApiError.notFound('calendar or event not found.');
  }
  if (!event.users.includes(userId)) throw ApiError.notFound('user not found');
  if (event.creator.equals(userId)) {
    throw ApiError.badRequest("can't remove event creator from users list");
  }

  if (!event.creator.equals(req.user.id)) {
    throw ApiError.authorizationError(
      'only the event creator can remove users',
    );
  }
  event.users.pull(userId);
  await calendar.save();
  res.status(204).end();
};

// updates events name or date
const updateEvent = async (req, res) => {
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar?.events?.id(eventId);
  if (!calendar && !event) {
    throw ApiError.notFound('calendar or event not found.');
  }
  const { name, date } = req.body;
  if (!name && !date) {
    throw ApiError.badRequest(
      'Malformatted arguments. Use either name (string), date (Date) or both.',
    );
  }
  if (name) event.name = name;
  if (date) event.date = date;
  const updatedCalendar = await calendar.save();
  res.json(updatedCalendar.events.id(eventId));
};

// removes an event if the current user is the creator
const removeEvent = async (req, res) => {
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar?.events?.id(eventId);
  if (!calendar && !event) {
    throw ApiError.notFound('calendar or event not found.');
  }
  if (
    event.creator.equals(req.user.id) ||
    calendar.creator.equals(req.user.id)
  ) {
    event.remove();
    await calendar.save();
    res.status(204).end();
  } else {
    throw ApiError.authorizationError(
      "you don't have permission to delete this event",
    );
  }
};

// gets all the users of a specific calendar
// maybe not required since we can get the array and its users by getCalendar method, we'll see.
const getUsers = async (req, res) => {
  const { calendarId } = req.params;
  const calendar = await Calendar.findById(calendarId).populate('users', {
    name: 1,
    _id: 1,
  });
  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  const userInCalendarUsers = calendar.users.some((user) =>
    user._id.equals(req.user.id),
  );
  if (!userInCalendarUsers) {
    throw ApiError.authorizationError(
      "can't return users of a calendar user is not part of",
    );
  }
  res.json(calendar.users);
};

// gets all the events of the calendar. Same as the method above, maybe not needed, but here the
// subfields are populated.
const getEvents = async (req, res) => {
  const { calendarId } = req.params;
  const calendar = await Calendar.findById(calendarId)
    .populate({
      path: 'events',
      populate: {
        path: 'users',
        model: 'User',
      },
    })
    .populate({
      path: 'events',
      populate: {
        path: 'creator',
        model: 'User',
      },
    });
  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  const userInCalendarUsers = calendar.users.some((user) =>
    user._id.equals(req.user.id),
  );
  if (!userInCalendarUsers) {
    throw ApiError.authorizationError(
      "can't return users of a calendar user is not part of",
    );
  }
  res.json(calendar.events);
};

module.exports = {
  getCalendars,
  createCalendar,
  getCalendar,
  addEvent,
  addUser,
  removeUser,
  addEventUser,
  removeEventUser,
  updateEvent,
  removeEvent,
  getUsers,
  getEvents,
  removeCalendar,
};
