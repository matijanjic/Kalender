import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/reducers/loginReducer';
import './Login.css';
import loginImage from './resources/login_illustration.svg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <div className="flex flex-col items-center justify-center gap-0 xl:gap-16">
      <div className="background--lines--1 drop-shadow-lg"></div>
      <main className="flex flex-row flex-wrap justify-center items-center xl:gap-48 w-screen -mt-6">
        <div className="flex-initial xl:min-w-fit -mt-16 mb-16 xl:m-0">
          <h1 className="text-3xl bold font-bold text-purple mb-2">Login</h1>
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
      <div className="background--lines--2 drop-shadow-lg"></div>
    </div>
  );
}

export default Login;
