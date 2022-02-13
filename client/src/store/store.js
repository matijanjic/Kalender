import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import loginReducer from '../store/reducers/loginReducer';
import calendarReducer from '../store/reducers/calendarReducer';

const reducer = combineReducers({
  login: loginReducer,
  calendars: calendarReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
