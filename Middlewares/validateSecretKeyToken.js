const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const validateSignupToken = (req, res, next) => {
    let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

    if (!token) {
        return next(
            new ApiError('Authorization token is missing. Please provide a valid token.', 401)
        );
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return next(new ApiError('Invalid token. Please check the provided token.', 401));
            } else if (err.name === 'TokenExpiredError') {
                return next(new ApiError('Token has expired. Please request a new token.', 401));
            }
            
            return next(new ApiError('Failed to authenticate token.', 500));
        }

        if (!decoded || !decoded.allowSignup) {
            return next(new ApiError('You are not authorized to sign up.', 403));
        }

        next();
    });
};

module.exports = validateSignupToken;