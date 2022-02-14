import React, { useState } from 'react';

function Modal() {
  const [show, setShow] = useState(true);

  return show ? (
    <div className="fixed bg-darkpurple w-1/3 h-80 inset-x-0 mx-auto top-1/4">
      <div>Modal</div>
      <button onClick={() => setShow(!show)}>Close</button>
    </div>
  ) : null;
}

export default Modal;
