import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../../store/reducers/loginReducer';
import logoImg from './resources/logo.svg';
import CustomLink from '../CustomLink/CustomLink';
import { useNavigate } from 'react-router-dom';

function Navbar({ children }) {
  const user = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logOut());
    navigate('/login');
  };

  if (!user) {
    return (
      <div>
        <nav className="flex flex-col mx-auto gap-8 justify-items-center  lg:w-auto lg:flex-row flex-wrap h-18 p-6 pt-16 lg:px-28 justify-between items-center">
          <img
            src={logoImg}
            alt="Kalen logo"
            className="cursor-pointer"
            onClick={() => navigate('/')}
          />
          <ul className="flex gap-6 mt-4 sm:flex-row md:mt-0 items-center sm:gap-12">
            <li>
              <CustomLink to="/login" className="nav-button">
                log in
              </CustomLink>
            </li>
            <li>
              <CustomLink to="/signup" className="nav-button">
                sign up
              </CustomLink>
            </li>
            <li>
              <CustomLink to="/about" className="nav-button">
                about
              </CustomLink>
            </li>
          </ul>
        </nav>
        {children}
      </div>
    );
  }

  //TODO add logged user username link in nav, where user setting and logout will reside

  return (
    <div>
      <nav className="flex flex-col mx-auto gap-8 justify-items-center  lg:w-auto lg:flex-row flex-wrap h-18 p-6 pt-16 lg:px-28 justify-between items-center">
        <img
          src={logoImg}
          alt="Kalen logo"
          className="m-0 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <ul className="flex gap-6 mt-4 sm:flex-row md:mt-0 items-center sm:gap-12">
          <li>
            <CustomLink to="/calendars" className="nav-button">
              calendars
            </CustomLink>
          </li>
          <li>
            <CustomLink to="/create-calendar" className="nav-button">
              create new
            </CustomLink>
          </li>
          <li>
            <button className="nav-button-logout" onClick={logout}>
              logout
            </button>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
}

export default Navbar;
