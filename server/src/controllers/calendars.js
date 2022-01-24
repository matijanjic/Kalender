const Calendar = require('../models/Calendar');
const ApiError = require('../utils/ApiError');

// returns all the calendars of the logged in user
const getCalendars = async (req, res) => {
  const { user } = req;
  console.log(user);
  const calendars = await Calendar.find({ users: user._id });
  console.log(calendars);
  res.send(calendars);
};

// creates a new calendar
const createCalendar = async (req, res) => {
  const calendar = req.body;
  // req.user available because of the extractUser middleware in the app.js
  calendar.creator = req.user.id;
  const calendarToSave = new Calendar(calendar);
  const savedCalendar = await calendarToSave.save();
  res.send(savedCalendar);
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
    res.send(204).end();
  } else {
    throw ApiError.authorizationError("you don't have permission to delete this calendar");
  }
};

// gets a specific calendar
const getCalendar = async (req, res) => {
  const { calendarId } = req.params;
  const calendar = await Calendar.findById(calendarId).populate('users');

  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  res.send(calendar);
};

// adds an event to the array of event subdocuments in the calendar
const addEvent = async (req, res) => {
  const { calendarId } = req.params;
  const event = req.body;
  event.creator = req.user.id;
  event.users = [event.users, req.user.id];
  // find the calendar and add the event to it
  const calendar = await Calendar.findById(calendarId);

  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  calendar.events.push(event);
  const savedCalendar = await calendar.save();

  res.send(savedCalendar);
};

// adds a user to the calendar users list
const addUser = async (req, res) => {
  const { calendarId } = req.params;
  const userId = req.body;

  const calendar = await Calendar.findById(calendarId);

  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  calendar.users.push(userId);
  await calendar.save();
  res.status(200).end();
};

// adds a user to the event subdocument inside a calendar
const addEventUser = async (req, res) => {
  const { id } = req.body;
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar.events.id(eventId);

  if (!calendar && !event) {
    throw ApiError.notFound('calendar or event not found.');
  }

  event.users.push(id);
  await calendar.save();
  res.status(200).end();
};

// removes a user from the event
const removeEventUser = async (req, res) => {
  const { id } = req.body;
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar.events.id(eventId);
  if (!calendar && !event) {
    throw ApiError.notFound('calendar or event not found.');
  }
  event.users.pull(id);
  await calendar.save();
  res.status(204).end();
};

// updates events name or date
const updateEvent = async (req, res) => {
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar.events.id(eventId);
  if (!calendar && !event) {
    throw ApiError.notFound('calendar or event not found.');
  }
  const { name, date } = req.body;
  if (!(name && date)) {
    throw ApiError.badRequest('Malformatted arguments. Use either name (string), date (Date) or both.');
  }
  if (name) event.name = name;
  if (date) event.date = date;
  await calendar.save();
  res.status(200).end();
};

// removes an event if the current user is the creator
const removeEvent = async (req, res) => {
  const { calendarId, eventId } = req.params;
  const calendar = await Calendar.findById(calendarId);
  const event = calendar.events.id(eventId);
  if (!calendar && !event) {
    throw ApiError.notFound('calendar or event not found.');
  }
  if (event.creator.toString() === req.user.id) {
    event.remove();
    await calendar.save();
    res.status(204).end();
  } else {
    throw ApiError.authorizationError("you don't have permission to delete this event");
  }
};

// gets all the users of a specific calendar
// maybe not required since we can get the array and its users by getCalendar method, we'll see.
const getUsers = async (req, res) => {
  const { calendarId } = req.params;
  const calendar = await Calendar.findById(calendarId).populate('users');
  if (!calendar) {
    throw ApiError.notFound('calendar not found.');
  }
  res.send(calendar.users);
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
  res.send(calendar.events);
};

module.exports = {
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
};
