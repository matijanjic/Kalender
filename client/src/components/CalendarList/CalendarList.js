import React from 'react';
import { useSelector } from 'react-redux';
import CalendarCard from '../CalendarCard/CalendarCard';
import './CalendarList.css';

function CalendarList() {
  const calendars = useSelector((state) => state.calendars);

  return (
    <div>
      <div className="background--lines--1 drop-shadow-xl"></div>
      {calendars.length !== 0 ? (
        <main className="grid grid-cols-4 gap-10 mx-24 my-10">
          {calendars.map((calendar) => (
            <CalendarCard calendar={calendar} key={calendar.id} />
          ))}
        </main>
      ) : (
        <div className="flex flex-row justify-center min-w-full mt-28">
          <div className="font-medium text-3xl text-purple">
            No calendars found :(
          </div>
        </div>
      )}

      <div className="background--lines--2 mt-24 drop-shadow-xl"></div>
    </div>
  );
}

export default CalendarList;
