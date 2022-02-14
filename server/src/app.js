const express = require('express');
const cors = require('cors');
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
app.use(cors());
app.use(express.static('build'));
// connect to the mongodb database
db.dbConnect();
app.use(requestLogger);
app.use(tokenExtractor);

// for parsing json requests
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/calendars', userExtractor, calendarRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
