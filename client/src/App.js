import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { checkLocalStorage } from './store/reducers/loginReducer';
import Calendars from './pages/calendars';
import Login from './pages/login';
import CreateCalendar from './pages/createCalendar';
import SignUp from './pages/signUp';
import CalendarView from './pages/calendarView';
import Home from './pages/home/home';

// TODO make a notification component and notify user about wrong credentials
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

  useEffect(() => {
    dispatch(checkLocalStorage());
  }, [dispatch]);

  const user = useSelector((state) => state.login);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="calendars"
        element={user ? <Calendars /> : <Navigate replace to="/login" />}
      />
      <Route path="calendars/:calendarId" element={<CalendarView />} />
      <Route path="calendars/:calendarId/events" element={<div>hello</div>} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="create-calendar" element={<CreateCalendar />} />
    </Routes>
  );
}

export default App;
