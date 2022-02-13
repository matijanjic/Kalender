import React from 'react';
import './CalendarCard.css';
import { useNavigate } from 'react-router-dom';

const calcDaysUntil = (date) =>
  Math.round(Math.abs(Date.now() - date) / (1000 * 60 * 60 * 24));

function CalendarCard({ calendar }) {
  const navigate = useNavigate();

  let daysUntilEvent;
  let upcomingEvent;
  if (calendar.events.length === 0) {
    upcomingEvent = 'no events';
    daysUntilEvent = 'no events added';
  } else {
    const events = calendar.events.sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
    upcomingEvent = events[0];
    const days = calcDaysUntil(Date.parse(upcomingEvent.date));

    if (days === 0) daysUntilEvent = 'today';
    if (days === 1) daysUntilEvent = 'tomorrow';
    daysUntilEvent = `in ${days} days`;
  }
  const animationStyle = {
    animationDuration: `${Math.random() + 1}s`,
    animationName: 'popout',
  };

  return (
    <div
      className="calendar-card"
      style={animationStyle}
      onClick={() => navigate(`/calendars/${calendar.id}`)}
    >
      <div className="calendar-card--name">{calendar.name}</div>
      <div className="py-6">
        <div className="font-semibold">upcoming:</div>
        <div className="font-medium">{upcomingEvent.name}</div>
        <div>{daysUntilEvent}</div>
      </div>
    </div>
  );
}

export default CalendarCard;
