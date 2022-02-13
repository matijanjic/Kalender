import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import CalendarList from './pages/CalendarList/CalendarList';
import Login from './pages/Login/Login';
import CreateCalendar from './pages/CreateCalendar/CreateCalendar';
import { checkLocalStorage } from './store/reducers/loginReducer';
import SignUp from './pages/SignUp/SignUp';

// TODO
// TODO WRITE TESTS
// TODO notification component and credentials check (during login and signup)
// TODO make calendarlist items clickable and lead to specific calendar
// TODO about section (technology stack)
// TODO main page
// TODO calendar view
// TODO event creation
// TODO calendar creation
// TODO responsivness
// TODO dark mode

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login);

  useEffect(() => {
    dispatch(checkLocalStorage());
  }, [dispatch]);

  // useEffect(() => {
  //   if (user) {
  //     dispatch(getCalendars());
  //     console.log(`dispatch called getCalendars`);
  //   }
  // }, [user, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<h3>Home</h3>} />
      <Route
        path="calendars"
        element={user ? <CalendarList /> : <Navigate replace to="/login" />}
      />
      <Route path="calendars/:calendarId" element={<h3>hello</h3>} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="create-calendar" element={<CreateCalendar />} />
    </Routes>
  );
}

export default App;
