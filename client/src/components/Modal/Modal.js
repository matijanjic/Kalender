import React from 'react';

function Modal({ selectedEvent, show, setShow }) {
  return (
    <>
      <div
        className={`fixed rounded-2xl left-0 right-0 top-40 mx-auto w-2/3 h-2/3 bg-pink z-50 ${
          show ? null : 'hidden'
        }`}
      >
        {selectedEvent.name}
      </div>
      <div
        className={`absolute inset-0 w-screen bg-blackpurple opacity-70 z-30 ${
          show ? null : 'hidden'
        }`}
        onClick={() => setShow(!show)}
      ></div>
    </>
  );
}

export default Modal;
