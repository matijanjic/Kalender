import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import calendarService from '../services/calendar';

function EventsView() {
  const params = useParams();
  const user = useSelector((state) => state.login);
  console.log(user);

  const [events, setEvents] = useState([]);

  const [searchParams] = useSearchParams();
  const year = parseInt(searchParams.get('year'));
  const month = parseInt(searchParams.get('month'));
  const day = parseInt(searchParams.get('day'));
  const calendar = useSelector((state) =>
    state.calendars.find((c) => c.id === params.calendarId),
  );
  console.log(calendar);

  const style = calendar
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${calendar.users.length + 1}, auto)`,
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
  console.log(events);

  return !events ? null : (
    <div className="ml-4  mt-4">
      <div className="absolute opacity-20">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="bg-purple rounded-l-2xl w-screen even:opacity-30  h-8 pl-4 col-start-1"
          ></div>
        ))}
      </div>
      <div style={style} className="justify-start gap-x-4">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="bg-purple w-24 h-8 odd:opacity-90 rounded-l-2xl rounded-r-md pl-4 col-start-1 font-montserrat font-bold pt-1 text-deepblackpurple"
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
  );
}

export default EventsView;
