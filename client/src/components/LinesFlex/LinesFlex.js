import React from 'react';
import './LinesFlex.css';

function LinesFlex({ children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0 xl:gap-16">
      <div className="background--lines--1 drop-shadow-lg"></div>
      {children}
      <div className="background--lines--2 drop-shadow-lg"></div>
    </div>
  );
}

export default LinesFlex;
