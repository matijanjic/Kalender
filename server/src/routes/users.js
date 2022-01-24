const express = require('express');
const {
  getUser,
  // getUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/users');
const { userExtractor, isCurrentUser } = require('../utils/middleware');
require('express-async-errors');

const router = express.Router();

// router.get('/', getUsers);
router.get('/:id', userExtractor, isCurrentUser, getUser);
router.post('/register', createUser);
router.patch('/:id', userExtractor, isCurrentUser, updateUser);
router.delete('/:id', userExtractor, isCurrentUser, deleteUser);

module.exports = router;
