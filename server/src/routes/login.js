const router = require('express').Router();
const { loginUser } = require('../services/loginService');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const loggedUser = await loginUser(username, password);
  res.json(loggedUser);
});

module.exports = router;
