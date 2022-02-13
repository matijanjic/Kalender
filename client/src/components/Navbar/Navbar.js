import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { logOut } from '../../store/reducers/loginReducer';
import logoImg from './resources/logo.svg';
import CustomLink from '../CustomLink/CustomLink';

function Navbar() {
  const user = useSelector((state) => state.login);
  const dispatch = useDispatch();

  if (!user) {
    return (
      <div>
        <nav className="xl:flex flex-row flex-wrap h-18 p-6 pt-16 px-28 justify-between mt-8 items-center">
          <img src={logoImg} alt="Kalen logo" className="m-auto mt-6 xl:m-0" />
          <ul className="md:flex flex-row flex-wrap gap-12 text-xl mt-11 xl:mt-0  ">
            <li className="mb-3 xl:mb-0 text-center">
              <CustomLink to="/login" className="nav-button">
                log in
              </CustomLink>
            </li>
            <li className="text-center mb-3 xl:mb-0">
              <CustomLink to="/signup" className="nav-button">
                sign up
              </CustomLink>
            </li>
            <li className="text-center mb-3 xl:mb-0">
              <CustomLink to="/about" className="nav-button">
                about
              </CustomLink>
            </li>
          </ul>
        </nav>
        <Outlet />
      </div>
    );
  }

  //TODO add logged user username link in nav, where user setting and logout will reside

  return (
    <div>
      <nav className="xl:flex flex-row flex-wrap h-18 p-6 pt-16 px-28 justify-between mt-8 items-center">
        <img src={logoImg} alt="Kalen logo" className="m-auto mt-6 xl:m-0" />
        <ul className="md:flex items-baseline flex-row flex-wrap gap-12 text-xl mt-11 xl:mt-0  ">
          <li className="text-center mb-3 xl:mb-0">
            <CustomLink to="/calendars" className="nav-button">
              calendars
            </CustomLink>
          </li>
          <li className="text-center mb-3 xl:mb-0">
            <CustomLink to="/create-calendar" className="nav-button">
              create new
            </CustomLink>
          </li>
          <li className="text-center mb-3 xl:mb-0">
            <button
              className="nav-button-logout"
              onClick={() => dispatch(logOut())}
            >
              logout
            </button>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
}

export default Navbar;
