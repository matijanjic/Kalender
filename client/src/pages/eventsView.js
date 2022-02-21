import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function EventsView() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const year = parseInt(searchParams.get('year'));
  const month = parseInt(searchParams.get('month'));
  const day = parseInt(searchParams.get('day'));

  const calendar = useSelector((state) =>
    state.calendars.find((c) => c.id === params.calendarId),
  );
  const events = calendar?.events.filter(
    (e) => new Date(e.date).getDate() === day, // TODO add month and year check
  );
  console.log(events);

  const styleHour = (hour) => {
    if (events.some((e) => hour === new Date(e.date).getHours()))
      return 'w-96 h-8 bg-pink brightness-150 border-deeppurple border-t-4 border-x-4';
    if (
      events.some(
        (e) =>
          hour < new Date(e.end).getHours() &&
          hour > new Date(e.date).getHours(),
      )
    )
      return 'w-96 h-8 bg-pink brightness-150 border-deeppurple border-x-4';
    if (events.some((e) => hour === new Date(e.end).getHours()))
      return 'w-96 h-8 bg-pink brightness-150 border-deeppurple border-b-4 border-x-4';
    return 'w-96 h-8 bg-purple brightness-150 outline outline-white';
  };

  return !events ? null : (
    <div className="flex ml-4">
      <div className="grid grid-cols-[repeat(2, auto)] ">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="bg-purple w-24 h-8 rounded-l-2xl pl-4 col-start-1"
          >
            {String(i).padStart(2, '0')}
            {/* <span className="text-center">
              {events.find((e) => new Date(e.date).getHours() === i)?.name}
            </span> */}
          </div>
        ))}
        {events.map((e) => {
          console.log(new Date(e.date).getHours(), new Date(e.end).getHours());
          const start = new Date(e.date).getHours();
          const end = new Date(e.end).getHours();
          const style = {
            gridRowStart: start,
            gridRowEnd: end,
            gridColumnStart: 2,
            width: 400,
          };
          return (
            <div key={e.name} style={style} className="bg-pink">
              {e.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EventsView;
