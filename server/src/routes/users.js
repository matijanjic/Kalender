const express = require('express');
const eventRouter = require('./events');
const {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/users');

require('express-async-errors');

const router = express.Router();

router.use('/:id/events', eventRouter);
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
