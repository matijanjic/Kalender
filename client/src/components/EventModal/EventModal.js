import React from 'react';

function EventModal({
  selectedEvent,
  show,
  setShow,
  setModalNotification,
  modalNotification,
}) {
  return (
    <>
      <div
        className={`fixed rounded-2xl left-0 right-0 top-20 mx-auto w-2/3 h-4/5 bg-gradient-to-br shadow-xl from-pink to-darkpink z-50 ${
          show && !modalNotification ? null : 'hidden'
        }`}
      >
        {selectedEvent.name}
      </div>
      <div
        className={`cursor-pointer absolute inset-0 w-screen bg-blackpurple opacity-80 z-30 ${
          show && !modalNotification ? null : 'hidden'
        }`}
        onClick={() => setModalNotification(true)}
      ></div>
    </>
  );
}

export default EventModal;
