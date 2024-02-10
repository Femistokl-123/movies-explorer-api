require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return next(new UnauthorizedErr('Необходима авторизация.'));
  }

  const secret = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
  let payload;

  try {
    payload = jwt.verify(token, secret);
  } catch (err) {
    return next(new UnauthorizedErr('Необходима авторизация.'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
