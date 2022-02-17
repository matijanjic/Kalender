import React, { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkLocalStorage } from '../store/reducers/loginReducer';
import CalendarNavbar from '../components/CalendarNavbar/CalendarNavbar';
import Calendar from '../components/Calendar/Calendar';
import { getCalendar } from '../store/reducers/calendarReducer';

function CalendarView() {
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkLocalStorage());
    dispatch(getCalendar(params.calendarId));
  }, []);
  const calendar = useSelector((state) => state.calendar);
  const events = calendar.events;

  return (
    <>
      <Outlet />
      <CalendarNavbar />
      {calendar.events ? <Calendar events={events} /> : null}
    </>
  );
}

export default CalendarView;
