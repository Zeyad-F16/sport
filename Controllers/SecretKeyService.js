const jwt = require('jsonwebtoken');

const ValidateSecret = (req , res)=>{
    const {secretKey} = req.body;
    
    const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
    
    if(secretKey !== ADMIN_SECRET_KEY){
        return res.status(403).json({message: 'Invalid secret key'});
    }
    
     // Generate a temporary token
    const tempToken = jwt.sign({allowSignup: true},process.env.JWT_SECRET,{expiresIn : '10m'});
    
    res.status(200).json({
        status: 'success',
        message: 'secret key validated',
        data: tempToken,
      });
};

module.exports = ValidateSecret;