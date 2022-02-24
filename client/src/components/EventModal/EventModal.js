import React, { useState } from 'react';
import useField from '../../hooks/useField';

function EventModal({
  selectedEvent,
  show,
  setShow,
  setModalNotification,
  modalNotification,
}) {
  // name, start date and end date (and time) from the event clicked on the eventsView page
  const { name, date, end } = selectedEvent;
  const parsedDate = new Date(date);
  const parsedEnd = new Date(end);

  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth();
  const day = parsedDate.getDate();

  // formatted times and dates for date and time input fields. Month has + 1 because it's zero indexed
  const formattedDate = `${year}-${`${month + 1}`.padStart(2, '0')}-${day}`;
  const startTime = `${`${parsedDate.getHours()}`.padStart(2, '0')}:00`;
  const endTime = `${`${parsedEnd.getHours()}`.padStart(2, '0')}:00`;

  // custom useField hook for handling inputs, destructured for the setValue function used in the reset function and the rest of the props used in the input
  const { setValue: setName, ...evName } = useField('text', name);
  const { setValue: setDate, ...evDate } = useField('date', formattedDate);
  const { setValue: setStart, ...evStartTime } = useField('time', startTime);
  const { setValue: setEnd, ...evEndTime } = useField('time', endTime);

  // backup values saved in case a reset is needed
  const backupVals = { name, formattedDate, startTime, endTime };
  const resetFields = () => {
    console.log(backupVals);
    setName(backupVals.name);
    setDate(backupVals.formattedDate);
    setStart(backupVals.startTime);
    setEnd(backupVals.endTime);
  };

  return !selectedEvent ? null : (
    <>
      <div
        className={`fixed rounded-2xl left-0 right-0 top-20 mx-auto w-2/3 h-4/5 bg-white shadow-xl z-50 ${
          modalNotification ? 'hidden' : null
        }`}
      >
        <form className="flex flex-col ml-12 mt-4">
          <label className="input-label">Event name:</label>
          <input className="input-purple" {...evName} />

          <label className="input-label">Date:</label>
          <input className="input-purple" {...evDate} />
          <label className="input-label">Start time:</label>
          <input className="input-purple" {...evStartTime} />
          <label className="input-label">End time:</label>
          <input className="input-purple" {...evEndTime} />
        </form>
        <button
          onClick={() => resetFields()}
          className="main-button-pink ml-12"
        >
          reset fields
        </button>
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
