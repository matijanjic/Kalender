import React, { useState } from 'react';
import userService from '../../services/users';
import './SignUp.css';
import loginImage from './resources/sign_up_illustration.svg';
import LinesFlex from '../LinesFlex/LinesFlex';

function SignUp() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repPassword, setRepPassword] = useState('');

  const signUp = (e) => {
    e.preventDefault();
    //TODO regex mail check
    //TODO make a notification component and notify user about wrong credentials

    if (password.length >= 6 && password === repPassword) {
      const user = {
        name,
        username,
        password,
        email,
      };

      console.log(user);

      const createdUser = userService.createUser(user);
      console.log(createdUser);

      setName('');
      setEmail('');
      setUsername('');
      setPassword('');
      setRepPassword('');
    }
  };

  return (
    <LinesFlex>
      <main className="flex flex-row flex-wrap justify-center items-center xl:gap-48 w-screen -mt-6">
        <div className="flex-initial xl:min-w-fit -mt-16 mb-16 xl:m-0">
          <h3>Sign up</h3>
          <form onSubmit={signUp} className="flex flex-col">
            <label htmlFor="name" className="input-label">
              name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={({ target }) => setName(target.value)}
              className="input-purple"
            />
            <label htmlFor="username" className="input-label">
              username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              className="input-purple"
            />
            <label htmlFor="email" className="input-label">
              email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              className="input-purple"
            />
            <label htmlFor="password" className="input-label">
              password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              className="input-purple"
            />
            <label htmlFor="repeat_password" className="input-label">
              repeat password:
            </label>
            <input
              id="repeat_password"
              type="password"
              value={repPassword}
              onChange={({ target }) => setRepPassword(target.value)}
              className="input-purple"
            />
            <div>
              <button type="submit" className="main-button-pink">
                sign up
              </button>
            </div>
          </form>
        </div>

        <img src={loginImage} alt="girl logging in" className="xl:h-80 h-0" />
      </main>
    </LinesFlex>
  );
}

export default SignUp;
