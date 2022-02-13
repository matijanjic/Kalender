import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LinesFlex from '../../components/LinesFlex/LinesFlex';
import { addCalendar } from '../../store/reducers/calendarReducer';
import Navbar from '../../components/Navbar/Navbar';

function CreateCalendar() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const createCalendar = (e) => {
    e.preventDefault();
    dispatch(addCalendar({ name: name }));
    navigate('/calendars');
  };

  return (
    <Navbar>
      <LinesFlex>
        <h3>Create a calendar</h3>
        <form onSubmit={createCalendar} className="flex flex-col">
          <label htmlFor="name" className="input-label">
            Calendar name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            className="input-purple"
          />
          <button type="submit" className="main-button-pink">
            create calendar
          </button>
        </form>
      </LinesFlex>
    </Navbar>
  );
}

export default CreateCalendar;
