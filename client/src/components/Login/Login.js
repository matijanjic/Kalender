import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/reducers/loginReducer';
import loginImage from './resources/login_illustration.svg';
import LinesFlex from '../LinesFlex/LinesFlex';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/calendars');
  }, [user, navigate]);

  const dispatch = useDispatch();

  const login = (e) => {
    e.preventDefault();
    const credentials = {
      username,
      password,
    };
    console.log(credentials);

    dispatch(setUser(credentials));
    setUsername('');
    setPassword('');
  };

  return (
    <LinesFlex>
      <main className="flex flex-row flex-wrap justify-center items-center xl:gap-48 w-screen -mt-6">
        <div className="flex-initial xl:min-w-fit -mt-16 mb-16 xl:m-0">
          <h3>Login</h3>
          <form onSubmit={login}>
            <div className="input-label">username:</div>
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              className="input-purple"
            />
            <div className="input-label">password:</div>
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              className="input-purple"
            />
            <div>
              <button type="submit" className="main-button-pink">
                log in
              </button>
            </div>
          </form>
        </div>

        <img src={loginImage} alt="girl logging in" className="xl:h-80 h-0" />
      </main>
    </LinesFlex>
  );
}

export default Login;
