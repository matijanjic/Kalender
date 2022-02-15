import React from 'react';
import whiteLogo from '../../pages/resources/logo_white.svg';

function Footer() {
  return (
    <footer className="bg-pink w-screen h-72 flex flex-row justify-around items-center">
      <img alt="logo" src={whiteLogo} className="w-40" />
      <div>
        <span className="font-bold text-white">created by:</span>
        <ul className="text-white">
          <li>Matija Janjic</li>
          <li>matijanjic@gmail.com</li>
          <li>github.com/matijanjic</li>
        </ul>
      </div>
      <div>
        <span className="font-bold text-white">main technologies used:</span>
        <ul className="text-white">
          <li>MERN stack (MongoDB, Express, React, Node)</li>
          <li>Redux and redux-thunk for state management</li>
          <li>Tailwind for styling</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
