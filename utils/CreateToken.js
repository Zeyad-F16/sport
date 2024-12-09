const jwt = require('jsonwebtoken');

const createToken = (payload) =>
  jwt.sign({ adminId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;