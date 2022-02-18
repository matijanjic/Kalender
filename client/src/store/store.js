import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import loginReducer from './reducers/loginReducer';
import calendarsReducer from './reducers/calendarsReducer';

const reducer = combineReducers({
  login: loginReducer,
  calendars: calendarsReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
