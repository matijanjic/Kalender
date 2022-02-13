import React from 'react';

const calcDaysUntil = (date) =>
  Math.round(Math.abs(Date.now() - date) / (1000 * 60 * 60 * 24));

function CalendarCard({ calendar }) {
  const events = calendar.events.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  const upcomingEvent = events[0];
  const days = calcDaysUntil(Date.parse(upcomingEvent.date));
  let daysUntilEvent;
  if (days === 0) daysUntilEvent = 'today';
  if (days === 1) daysUntilEvent = 'tomorrow';
  daysUntilEvent = `in ${days} days`;

  return (
    <div className="flex flex-col justify-around items-center text-center text-white bg-gradient-to-br from-purple to-darkpurple hover:from-pink hover:to-purple hover:text-white h-48 shadow-sm rounded-xl hover:scale-105 hover:cursor-pointer hover:shadow-lg transition-all ease-in-out delay-75">
      <div className="flex justify-center items-center mt-4 font-medium text-xl text-center h-1/5 w-5/6">
        {calendar.name}
      </div>
      <div className="py-6">
        <div className="font-semibold">upcoming:</div>
        <div className="font-medium">{upcomingEvent.name}</div>
        <div>{daysUntilEvent}</div>
      </div>
    </div>
  );
}

export default CalendarCard;
