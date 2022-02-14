import calendarService from '../../services/calendar';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_CALENDAR':
      return action.data;
    default:
      return state;
  }
};

export const getCalendar = (id) => {
  return async (dispatch) => {
    const calendar = await calendarService.getCalendar(id);
    dispatch({
      type: 'SET_CALENDAR',
      data: calendar,
    });
  };
};

export default reducer;
