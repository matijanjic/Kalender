import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCalendar } from '../../store/reducers/calendarReducer';
import { useParams } from 'react-router-dom';
// button for switching between months, prevOrNext string variable decides will it go forward or backwards
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
// component for displaying current month
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

const Modal = () => {
  return (
    <div className="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple w-1/2 h-5/6 z-30">
      hehehe
    </div>
  );
};

function Calendar() {
  const [date, setDate] = useState({ day: 0, month: 0, year: 0 });
  const [dateNow, setDateNow] = useState({ day: 0, month: 0, year: 0 });
  const dispatch = useDispatch();
  const params = useParams();
  const events = useSelector((state) => state.calendar.events);

  // TODO dates in the middle, low opacity
  // TODO transition animation when changing months
  // TODO add dates to days from previous and next month
  const parsedDateEvents = events.map((e) => {
    return {
      ...e,
      date: new Date(e.date),
    };
  });
  console.log(parsedDateEvents);

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
    // dates.forEach((date) => console.log(date.textContent));
  }, []);

  const daysInMonth = new Date(date.year, date.month + 1, 0).getDate();
  // calculating the first day of the week. + 6 is here because by Default Sunday is first and we need Monday
  let firstWeekdayOfMonth = new Date(date.year, date.month, 1).getDay() + 6;
  firstWeekdayOfMonth =
    firstWeekdayOfMonth >= 7 ? firstWeekdayOfMonth - 7 : firstWeekdayOfMonth;

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
      {/* <Modal /> */}
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
          if (date.day === i + 1 && date.month === dateNow.month) {
            return (
              <div
                key={i}
                className="hover:scale-105 font-montserrat outline outline-2 outline-purple z-10 text-8xl font-bold w-full h-32 flex text-center  items-center justify-center transition-all ease-in-out duration-75 cursor-pointer"
              >
                <span key={i + 'span'} className="dates text-purple opacity-20">
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
          } else {
            return (
              <div
                key={i}
                className="hover:scale-105 hover:shadow-xl font-montserrat outline outline-2 rounded-sm outline-pink text-pink text-8xl font-bold w-full h-32 flex text-center items-center justify-center transition-all ease-in-out duration-75 cursor-pointer"
              >
                <span key={i} className="dates opacity-10 absolute">
                  {i + 1}
                </span>
                <div key={i + 'div'} className="text-sm z-10">
                  {findEvents(i).map((event) => (
                    <div key={event._id} className="mb-1 text-left pl-2">
                      {event.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}

export default Calendar;
