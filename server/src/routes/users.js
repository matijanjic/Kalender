const express = require('express');
const {
  getUser,
  getUsers,
  createUser,
  deleteUser,
} = require('../services/userService');

require('express-async-errors');

const router = express.Router();

router.get('/', async (_req, res) => {
  const users = await getUsers();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await getUser(id);
  res.json(user);
});

router.post('/', async (req, res) => {
  const createdUser = await createUser(req.body);
  res.json(createdUser);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  deleteUser(id);
  res.status(204).end();
});

module.exports = router;
