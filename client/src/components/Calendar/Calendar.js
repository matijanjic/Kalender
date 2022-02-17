import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCalendar } from '../../store/reducers/calendarReducer';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import DayCard from '../DayCard/DayCard';

// button for switching between months, prevOrNext string variable decides
// will it go forward or backwards
const BtnMonth = ({ date, setDate, prevOrNext }) => {
  let n;
  switch (prevOrNext) {
    case 'prev':
      n = -1;
      break;
    case 'next':
      n = 1;
      break;
    default:
      n = 0;
  }
  return (
    <button
      className="text-deeppurple font-bold hover:text-purple"
      onClick={() => setDate({ ...date, month: date.month + n })}
    >
      {new Date(date.year, date.month + n).toLocaleDateString('default', {
        month: 'long',
      })}
    </button>
  );
};
// component for displaying current month in locale string
const CurrentMonth = ({ date }) => {
  return (
    <div className="font-bold text-3xl">
      {new Date(date.year, date.month).toLocaleDateString('default', {
        month: 'long',
        year: 'numeric',
      })}
    </div>
  );
};

// main calendar component which is used to show DayCards
// and enables us to switch months and see events.
// By clicking on the DayCard, it shows the event view for that day

function Calendar() {
  const [date, setDate] = useState({ day: 0, month: 0, year: 0 });
  const [dateNow, setDateNow] = useState({ day: 0, month: 0, year: 0 });
  const dispatch = useDispatch();
  const params = useParams();
  const events = useSelector((state) => state.calendar.events);

  // TODO transition animation when changing months
  // TODO add dates to days from previous and next month

  // parses the dates from the database to a Date object
  const parsedDateEvents = events.map((e) => {
    return {
      ...e,
      date: new Date(e.date),
    };
  });
  console.log(parsedDateEvents);

  // gets a single calendar from the DB and sets it to redux state
  // and initializes the current date and dateNow objects.
  // They are both set to the same date initialy, but the date is
  // altered when moving between months, and dateNow is used to
  // have a reference to the current date.

  useEffect(() => {
    dispatch(getCalendar(params.calendarId));
    const now = new Date();
    setDate({
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    });
    setDateNow({
      day: now.getDate(),
      month: now.getMonth(),
      year: now.getFullYear(),
    });
  }, []);

  // calculating how many days in the month.
  // +1 is the next month, and the 0 days gets us the last day
  // of the previous (actually current) month
  const daysInMonth = new Date(date.year, date.month + 1, 0).getDate();
  // calculating the first day of the week. + 6 is here because by Default Sunday is first and we need Monday
  let firstWeekdayOfMonth = new Date(date.year, date.month, 1).getDay() + 6;
  firstWeekdayOfMonth =
    firstWeekdayOfMonth >= 7 ? firstWeekdayOfMonth - 7 : firstWeekdayOfMonth;

  // finds events that fall on the day requested
  const findEvents = (dayIndex) => {
    const event = parsedDateEvents.filter((e) => {
      if (
        e.date.getFullYear() === date.year &&
        e.date.getMonth() === date.month &&
        e.date.getDate() === dayIndex + 1
      ) {
        return e;
      }
      return null;
    });
    return event;
  };

  return (
    <>
      <div className="flex flex-row justify-center items-baseline text-purple gap-4 mb-20 text-center mt-20">
        <BtnMonth date={date} setDate={setDate} prevOrNext={'prev'} />
        <CurrentMonth date={date} />
        <BtnMonth date={date} setDate={setDate} prevOrNext={'next'} />
      </div>
      <div className="grid grid-cols-7 grid-rows-4 w-5/6 h-10 text-center mx-auto font-montserrat uppercase font-bold text-blackpurple">
        <div>Monday</div>
        <div>Tuesday</div>
        <div>Wednesday</div>
        <div>Thursday</div>
        <div>Friday</div>
        <div>Saturday</div>
        <div>Sunday</div>
      </div>
      {/* empty days before first day of the month */}
      <div className="grid grid-cols-7 grid-rows-4 gap-2 w-5/6 mx-auto">
        {Array.from({ length: firstWeekdayOfMonth }, (_, i) => (
          <div key={i} className="w-full h-32"></div>
        ))}
        {/* creating the month calendar with the current date as different color*/}
        {Array.from({ length: daysInMonth }, (_, i) => {
          return (
            <DayCard
              date={date}
              dateNow={dateNow}
              i={i}
              findEvents={findEvents}
            />
          );
        })}
      </div>
    </>
  );
}

export default Calendar;
