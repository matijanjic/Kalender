import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Calendars from './pages/calendars';
import Login from './pages/login';
import CreateCalendar from './pages/createCalendar';
import SignUp from './pages/signUp';
import { checkLocalStorage } from './store/reducers/loginReducer';

// TODO WRITE TESTS
// TODO notification component and credentials check (during login and signup)
// TODO about section (technology stack)
// TODO main page
// TODO calendar view
// TODO event creation
// TODO check responsivness
// TODO dark mode

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(checkLocalStorage());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<h3>Home</h3>} />
      <Route
        path="calendars"
        element={user ? <Calendars /> : <Navigate replace to="/login" />}
      />
      <Route path="calendars/:calendarId" element={<h3>hello</h3>} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="create-calendar" element={<CreateCalendar />} />
    </Routes>
  );
}

export default App;
