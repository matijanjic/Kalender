const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/users');
const { userExtractor, isCurrentUser } = require('../utils/middleware');
require('express-async-errors');

const router = express.Router();

router.get('/', userExtractor, getUsers);
router.get('/:id', userExtractor, isCurrentUser, getUser);
router.post('/', createUser);
router.patch('/:id', userExtractor, isCurrentUser, updateUser);
router.delete('/:id', userExtractor, isCurrentUser, deleteUser);

module.exports = router;
