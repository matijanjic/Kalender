import calendarService from '../../services/calendar';

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_CALENDARS':
      return [...action.data];
    case 'ADD_CALENDAR':
      return [...state, action.data];
    default:
      return state;
  }
};

export const getCalendars = () => {
  return async (dispatch) => {
    const calendars = await calendarService.getCalendars();
    console.log(calendars);
    dispatch({
      type: 'INIT_CALENDARS',
      data: calendars,
    });
  };
};

export const addCalendar = (name) => {
  return async (dispatch) => {
    const savedCalendar = await calendarService.addCalendar(name);
    console.log('saved calendar in reducer', savedCalendar);
  };
};

export default reducer;
