import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import './CalendarNavbar.css';

function CalendarNavbar({ children }) {
  const params = useParams();
  const calendar = useSelector((state) =>
    state.calendars.find((c) => c.id === params.calendarId),
  );

  const navigate = useNavigate();
  // add event, remove event, add user, remove user, delete calendar
  return !calendar ? null : (
    <>
      <nav className="xl:flex flex-row gap-8 flex-wrap h-24 p-6 px-14 justify-between items-center bg-purple">
        <button
          className="back-button "
          onClick={() => navigate('/calendars')}
        ></button>
        <h3 className="text-white mt-2 ">{calendar.name}</h3>
        <button className="nav-button-calendar ml-auto">add event</button>
        <button className="nav-button-calendar">remove event</button>
        <button className="nav-button-calendar">add user</button>
        <button className="nav-button-calendar">remove user</button>
        <button className="nav-button-calendar">delete calendar</button>
      </nav>
    </>
  );
}

export default CalendarNavbar;
