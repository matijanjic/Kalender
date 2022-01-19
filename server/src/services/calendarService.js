const Calendar = require('../models/Calendar');

const getCalendars = async () => {
  const calendars = await Calendar.find({}).populate('users').populate('events');
  return calendars.map((calendar) => calendar.toJSON());
};

const createCalendar = async (calendar) => {
  const calendarToSave = new Calendar(calendar);
  const savedCalendar = await calendarToSave.save();
  return savedCalendar.toJSON();
};

module.exports = {
  getCalendars,
  createCalendar,
};
