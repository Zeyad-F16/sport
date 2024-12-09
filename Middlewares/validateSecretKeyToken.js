const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const validateSignupToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return next(new ApiError('you typed the secert key wrong , please retype it',401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            if(err.name === 'JsonWebTokenError'){
                return next(new ApiError('Invalid Token',401));
            }
            else if(err.name === 'TokenExpiredError'){
                return next(new ApiError('Expired Token',401));
            }
        }
        if (!decoded || !decoded.allowSignup){
           return next(new ApiError('you are not allowed to Signup',401));
         }
        
        next();
    });
};

module.exports = validateSignupToken;