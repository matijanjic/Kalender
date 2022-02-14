const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
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

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3002;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
    );
  });
} else {
  const app = express();
  app.use(cors());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../../client/build')));

  db.dbConnect();
  app.use(requestLogger);
  app.use(tokenExtractor);

  app.use(express.json());

  app.use('/api/users', userRouter);
  app.use('/api/login', loginRouter);
  app.use('/api/calendars', userExtractor, calendarRouter);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (_request, response) => {
    response.sendFile(
      path.resolve(__dirname, '../react-ui/build', 'index.html'),
    );
  });

  app.use(unknownEndpoint);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.error(
      `Node ${
        isDev ? 'dev server' : `cluster worker ${process.pid}`
      }: listening on port ${PORT}`,
    );
  });
}
