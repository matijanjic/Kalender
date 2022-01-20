const express = require('express');
const userRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const eventRouter = require('./routes/events');
const calendarRouter = require('./routes/calendars');
const db = require('./db/db');
const middleware = require('./utils/middleware');
require('express-async-errors');

const app = express();

// connect to the mongodb database
db.dbConnect();
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// for parsing json requests
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/events', eventRouter);
app.use('/api/calendars', calendarRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
