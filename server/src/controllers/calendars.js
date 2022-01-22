const Calendar = require('../models/Calendar');

const getCalendars = async (req, res) => {
  const { user } = req;
  const calendars = await Calendar.find({ users: user.id }).populate('users').populate('events');
  res.send(calendars.map((calendar) => calendar.toJSON()));
};

const createCalendar = async (req, res) => {
  const calendar = req.body;
  const calendarToSave = new Calendar(calendar);
  const savedCalendar = await calendarToSave.save();
  res.send(savedCalendar.toJSON());
};

module.exports = {
  getCalendars,
  createCalendar,
};
