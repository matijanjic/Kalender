import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    <CalendarNavbar>
      {calendar.events ? <Calendar events={events} /> : null}
      <div className="flex-col dark:text-purple dark:brightness-110 items-center text-center align-middle conte w-1/4 mx-auto mt-4">
        <div className="font-bold">calendar name:</div>
        <div>{calendar.name}</div>
        <div className="font-bold">events:</div>
        {calendar.events?.map((event, i) => {
          const date = new Date(event.date);
          const mins = date.getMinutes();
          const hour = date.getHours();
          const days = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          return (
            <div key={event._id}>
              <div key={event.name}>{event.name}</div>
              <div
                key={event.date}
              >{`${days}/${month}/${year} - ${hour}:${mins}`}</div>
            </div>
          );
        })}
        <div className="font-bold">users:</div>
        {calendar.users?.map((user) => (
          <div key={user.name}>{user.name}</div>
        ))}
      </div>
    </CalendarNavbar>
  );
}

export default CalendarView;
