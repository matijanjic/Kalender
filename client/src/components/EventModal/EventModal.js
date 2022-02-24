import React, { useState } from 'react';
import useField from '../../hooks/useField';

function EventModal({
  selectedEvent,
  show,
  setShow,
  setModalNotification,
  modalNotification,
}) {
  const { name, date, end } = selectedEvent;
  const parsedDate = new Date(date);
  const parsedEnd = new Date(end);

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth();
  const day = parsedDate.getDate();
  const formattedDate = `${year}-${`${month + 1}`.padStart(2, '0')}-${day}`;

  const startTime = `${`${parsedDate.getHours() - 1}`.padStart(2, '0')}:00`;
  const endTime = `${`${parsedEnd.getHours() - 1}`.padStart(2, '0')}:00`;

  const eventName = useField('text', name);
  const eventDate = useField('date', formattedDate);
  const eventStartTime = useField('time', startTime);
  const eventEndTime = useField('time', endTime);

  return !selectedEvent ? null : (
    <>
      <div
        className={`fixed rounded-2xl left-0 right-0 top-20 mx-auto w-2/3 h-4/5 bg-white shadow-xl z-50 ${
          modalNotification ? 'hidden' : null
        }`}
      >
        <form className="flex flex-col ml-12 mt-4">
          <label className="input-label">Event name:</label>
          <input className="input-purple" {...eventName} />

          <label className="input-label">Date:</label>
          <input className="input-purple" {...eventDate} />
          <label className="input-label">Start time:</label>
          <input className="input-purple" {...eventStartTime} />
          <label className="input-label">End time:</label>
          <input className="input-purple" {...eventEndTime} />
        </form>
      </div>
      <div
        className={`cursor-pointer absolute inset-0 w-screen bg-blackpurple opacity-80 z-30 ${
          modalNotification ? 'hidden' : null
        }`}
        onClick={() => setModalNotification(true)}
      ></div>
    </>
  );
}

export default EventModal;
