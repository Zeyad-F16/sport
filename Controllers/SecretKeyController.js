const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Validate the secret key
const ValidateSecret = (req , res , next)=>{
    const {secretKey} = req.body;
    
    if(secretKey !== process.env.ADMIN_SECRET_KEY){
       return next(new ApiError('Invalid Secret Key',401));
    }
    
     // Generate a temporary token
    const tempToken = jwt.sign({allowSignup: true},process.env.JWT_SECRET,{expiresIn : '10m'});
    
    res.status(200).json({status: 'success', token: tempToken});
};

module.exports = ValidateSecret;