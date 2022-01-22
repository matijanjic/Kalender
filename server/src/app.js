const express = require('express');
const userRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const calendarRouter = require('./routes/calendars');
const db = require('./db/db');
const {
  userExtractor,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
} = require('./utils/middleware');

require('express-async-errors');

const app = express();

// connect to the mongodb database
db.dbConnect();
app.use(requestLogger);
app.use(tokenExtractor);

// for parsing json requests
app.use(express.json());

app.use('/api/users', userRouter); // TODO: add userExtractor to some of the routes
app.use('/api/login', loginRouter);
app.use('/api/calendars', userExtractor, calendarRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
