import React from 'react';
import './DayCard.css';

function DayCard({ date, dateNow, i, findEvents }) {
  // if the day is today, style the card differently
  let style;
  if (date.day === i + 1 && date.month === dateNow.month) {
    style = 'day-card--current';
  } else {
    style = 'day-card';
  }
  console.log(date.day, i + 1, style);

  return (
    <div key={i} className={style}>
      <span key={i + 'span'} className="dates opacity-20">
        {i + 1}
      </span>
      <div key={i + 'div'} className="text-sm z-10 absolute">
        {findEvents(i).map((event) => (
          <div className="mb-1 text-left" key={event._id}>
            {event.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DayCard;
