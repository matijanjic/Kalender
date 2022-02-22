import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import calendarService from '../services/calendar';
import CalendarNavbar from '../components/CalendarNavbar/CalendarNavbar';
import Footer from '../components/Footer/Footer';

function EventsView() {
  const params = useParams();
  const user = useSelector((state) => state.login);

  const [events, setEvents] = useState([]);

  const [searchParams] = useSearchParams();
  const year = parseInt(searchParams.get('year'));
  const month = parseInt(searchParams.get('month'));
  const day = parseInt(searchParams.get('day'));
  const calendar = useSelector((state) =>
    state.calendars.find((c) => c.id === params.calendarId),
  );

  const style = calendar
    ? {
        display: 'grid',
        gridTemplateColumns: `6rem repeat(${calendar.users.length + 1}, 200px)`,
        gap: '0 2em',
      }
    : null;

  useEffect(() => {
    if (user) {
      calendarService
        .getEvents(params.calendarId)
        .then((events) =>
          setEvents(events.filter((e) => new Date(e.date).getDate() === day)),
        );
    }
  }, [user]);

  return !events || !calendar ? null : (
    <>
      <CalendarNavbar />
      {/* TODO fix the back button on the navbar so it leads to the previous page*/}
      {/* TODO keep the events panel fixed size, add scrolling so the space to the right can be reserved for editing events*/}

      <div className="ml-4 mt-32 mb-32 relative w-fit px-10">
        {/* responsible for showing the user names above */}
        <div style={style} className="sticky top-2 z-20">
          {calendar.users.map((u, i) => (
            <div
              key={u.username}
              className={`col-start-${
                i + 2
              } text-center font-bold text-white bg-purple rounded-xl text-xl`}
            >
              {u.name}
            </div>
          ))}
        </div>

        <div className="absolute opacity-20 w-full">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="bg-purple rounded-l-2xl w-full even:opacity-30 h-8 pl-4 col-start-1"
            ></div>
          ))}
        </div>
        <div style={style} className="justify-start">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="bg-purple w-16 h-8 odd:opacity-90 rounded-l-2xl rounded-r-md pl-4 col-start-1 font-montserrat font-bold pt-1 text-deepblackpurple"
            >
              {String(i).padStart(2, '0')}
            </div>
          ))}
          {events.map((e) => {
            const start = new Date(e.date).getHours();
            const end = new Date(e.end).getHours();
            const style = {
              gridRowStart: start,
              gridRowEnd: end,
              gridColumnStart: `${
                e.creator.username === user.username
                  ? 2
                  : calendar.users.findIndex(
                      (u) => u.username === e.creator.username,
                    ) + 2
              }`,
              width: 200,
            };
            return (
              <div
                key={e.name}
                style={style}
                className="bg-pink z-10 rounded-xl flex text-center items-center justify-center px-1 text-white font-bold shadow-md"
              >
                <div>{e.name}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EventsView;
