const jwt = require('jsonwebtoken');

// Create a token
const createToken = (payload) =>
  jwt.sign({ adminId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;