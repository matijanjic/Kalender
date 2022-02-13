import loginService from '../../services/login';
import { setToken } from '../../services/calendar';
import { useNavigate } from 'react-router-dom';

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data;
    case 'LOGOUT_USER':
      return null;
    default:
      return state;
  }
};

export const checkLocalStorage = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('JSONloginInfo');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setToken(user.token);
      dispatch({
        type: 'SET_USER',
        data: user,
      });
    }
  };
};

export const setUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials);
    window.localStorage.setItem('JSONloginInfo', JSON.stringify(user));
    setToken(user.token);
    console.log(user);
    dispatch({
      type: 'SET_USER',
      data: user,
    });
  };
};

export const logOut = () => {
  return (dispatch) => {
    window.localStorage.removeItem('JSONloginInfo');
    dispatch({
      type: 'LOGOUT_USER',
      data: null,
    });
  };
};

export default reducer;
