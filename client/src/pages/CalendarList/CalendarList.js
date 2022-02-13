import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CalendarCard from '../../components/CalendarCard/CalendarCard';
import { getCalendars } from '../../store/reducers/calendarReducer';
import Navbar from '../../components/Navbar/Navbar';

function CalendarList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCalendars());
  }, [dispatch]);
  const calendars = useSelector((state) => state.calendars);

  return (
    <Navbar>
      <div>
        <div className="background--lines--1 drop-shadow-xl"></div>
        {calendars.length !== 0 ? (
          <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 mx-24 my-10">
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
    </Navbar>
  );
}

export default CalendarList;
