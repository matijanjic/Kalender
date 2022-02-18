import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CalendarNavbar from '../components/CalendarNavbar/CalendarNavbar';
import Calendar from '../components/Calendar/Calendar';
import Footer from '../components/Footer/Footer';

function CalendarView() {
  const params = useParams();
  const calendar = useSelector((state) =>
    state.calendars.find((c) => c.id === params.calendarId),
  );

  return (
    <>
      <CalendarNavbar />
      {calendar?.events ? (
        <Calendar events={calendar.events} />
      ) : (
        <div className="h-screen"></div>
      )}
      <Footer />
    </>
  );
}

export default CalendarView;
