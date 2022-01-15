const router = require('express').Router();
const { loginUser } = require('../services/loginService');

// eslint-disable-next-line no-unused-vars
router.post('/', async (req, res, next) => {
  const { username, password } = req.body;
  const loggedUser = await loginUser(username, password);
  res.json(loggedUser);
});

module.exports = router;
