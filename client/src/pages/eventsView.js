import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import calendarService from '../services/calendar';
import CalendarNavbar from '../components/CalendarNavbar/CalendarNavbar';
import Footer from '../components/Footer/Footer';
import EventModal from '../components/EventModal/EventModal';

function EventsView() {
  const params = useParams();
  const user = useSelector((state) => state.login);
  const [show, setShow] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [modalNotification, setModalNotification] = useState(false);

  const [searchParams] = useSearchParams();
  const year = parseInt(searchParams.get('year'));
  const month = parseInt(searchParams.get('month'));
  const day = parseInt(searchParams.get('day'));
  const calendar = useSelector((state) =>
    state.calendars.find((c) => c.id === params.calendarId),
  );
  // setting the event calendar grid programatically depending on the number of users.
  // + 1 is because the hours column takes one space
  const style = calendar
    ? {
        display: 'grid',
        gridTemplateColumns: `6rem repeat(${calendar.users.length + 1}, 12em)`,
        gap: '0 1em',
      }
    : null;

  useEffect(() => {
    if (user) {
      // set the events to events from day that matches current day user is viewing
      calendarService.getEvents(params.calendarId).then((events) =>
        setEvents(
          events.filter((e) => {
            const eventDate = new Date(e.date);
            if (
              eventDate.getFullYear() === year &&
              eventDate.getMonth() === month &&
              eventDate.getDate() === day
            ) {
              return e;
            }
          }),
        ),
      );
    }
  }, [user]);
  console.log(events);

  return !calendar ? null : (
    <div className="relative">
      <EventModal
        selectedEvent={selectedEvent}
        show={show}
        setShow={setShow}
        setModalNotification={setModalNotification}
        modalNotification={modalNotification}
      />
      <CalendarNavbar />

      <header className="text-3xl font-bold font-montserrat text-pink text-center mt-12">
        {day} / {month} / {year}
      </header>
      {/* TODO fix the back button on the navbar so it leads to the previous page*/}
      {/* TODO keep the events panel fixed size, add scrolling so the space to the right can be reserved for editing events*/}
      <div className="ml-4 mt-16 mb-32 relative w-fit px-10">
        {/* responsible for showing the user names above the columns*/}
        <div style={style} className="sticky top-2 z-20">
          <div className="col-start-1"></div>
          {calendar.users.map((u, i) => (
            <div
              key={u.username}
              className={`text-center flex justify-center items-center shadow-xl font-bold text-white rounded-xl text-xl py-2 ${
                i === 0 ? 'bg-pink' : 'bg-purple'
              }`}
            >
              {i === 0 ? (
                <div>My events</div>
              ) : u.username !== user.username ? (
                <div>
                  <div>{u.name}</div>
                  <div className="text-sm">{u.username}</div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* background lines */}
        <div className="absolute opacity-20 w-full">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="bg-purple rounded-l-2xl rounded-r-2xl w-full even:opacity-30 h-8 pl-4 col-start-1"
            ></div>
          ))}
        </div>

        {/* hours */}
        <div style={style} className="justify-start">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="bg-purple w-16 h-8 odd:opacity-90 rounded-l-2xl text-right pr-3 col-start-1 font-montserrat font-bold pt-1 text-white"
            >
              {String(i).padStart(2, '0')} h
            </div>
          ))}

          {/* showing events */}
          {calendar.users.map((u) => {
            return events.map((e) => {
              if (e.users.some((evUser) => evUser.username === u.username)) {
                const start = new Date(e.date).getHours();
                const end = new Date(e.end).getHours();
                const style = {
                  gridRowStart: start,
                  gridRowEnd: end,
                  gridColumnStart: `${
                    calendar.users.findIndex(
                      (calUser) => calUser.username === u.username,
                    ) + 2
                  }`,
                  width: 'auto',
                };

                return (
                  <div
                    key={e.name + u.username}
                    style={style}
                    className={`hover:scale-105 cursor-pointer transition-transform ease-in-out duration-75 z-10 rounded-xl flex text-center items-center justify-center px-1 text-white font-bold shadow-md ${
                      u.username === user.username ? 'bg-pink' : 'bg-purple'
                    }`}
                    onClick={() => {
                      if (!modalNotification) {
                        setSelectedEvent(e);
                        setShow(!show);
                      } else {
                        const notif = document.querySelector(
                          '.modal-notification',
                        );
                        console.log(notif);

                        notif.classList.add('shake');
                        console.log(notif);
                        setTimeout(() => {
                          notif.classList.remove('shake');
                        }, 1000);
                      }
                    }}
                  >
                    <div>{e.name}</div>
                  </div>
                );
              } else return null;
            });
          })}
        </div>
      </div>
      <div
        className={`modal-notification fixed right-4 bottom-4 h-20 w-fit px-4 text-white font-bold cursor-pointer hover:scale-105 shadow-xl rounded-full flex justify-center items-center bg-purple ${
          modalNotification ? null : 'hidden'
        }`}
        onClick={() => {
          setShow(true);
          setModalNotification(false);
        }}
      >
        continue editing
      </div>

      <Footer />
    </div>
  );
}

export default EventsView;
