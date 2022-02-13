import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CalendarList from './components/CalendarList/CalendarList';
import Login from './components/Login/Login';
import CreateCalendar from './components/CreateCalendar/CreateCalendar';
import { checkLocalStorage } from './store/reducers/loginReducer';
import { getCalendars } from './store/reducers/calendarReducer';
import SignUp from './components/SignUp/SignUp';

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
    <div className="-mt-9 ">
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route
            path="calendars"
            element={user ? <CalendarList /> : <Navigate replace to="/login" />}
          />
          <Route path="calendars/:calendarId" element={<div>hello</div>} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="create-calendar" element={<CreateCalendar />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
