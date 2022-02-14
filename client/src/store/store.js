import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import loginReducer from './reducers/loginReducer';
import calendarsReducer from './reducers/calendarsReducer';
import calendarReducer from './reducers/calendarReducer.js';

const reducer = combineReducers({
  login: loginReducer,
  calendars: calendarsReducer,
  calendar: calendarReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
