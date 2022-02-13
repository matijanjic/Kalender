import calendarService from '../../services/calendar';

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_CALENDARS':
      return [...action.data];
    case '':
      return null;
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

export default reducer;
