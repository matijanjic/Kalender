const jwt = require('jsonwebtoken');
const ApiError = require('./ApiError');
const logger = require('./logger');
const User = require('../models/User');

const unknownEndpoint = (request, response, next) => {
  next(ApiError.unknownEndpoint('page not found'));
};

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id or wrong type' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' });
  }

  if (error instanceof ApiError) {
    return response.status(error.code).json(error.message);
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!req.token || !decodedToken) {
    next(ApiError.authorizationError('token missing'));
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    next(ApiError.authorizationError('user not found'));
  }
  req.user = user;
  next();
};

// checks if the user id in the endpoint is the same as the logged in user.
// Used so the logged in user would't be able to delete or modify other users resources
// Has to be used after the userExtractor middleware
const isCurrentUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    req.isCurrentUser = true;
    next();
  } else {
    next(ApiError.authorizationError('trying to access data from another user'));
  }
};

module.exports = {
  errorHandler, tokenExtractor, requestLogger, unknownEndpoint, userExtractor, isCurrentUser,
};
