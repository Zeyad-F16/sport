const { validationResult } = require('express-validator');

const validatorMiddleWare =  (req,res,next)=>{    
    const error =validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error : error.array()});
    }
    next();
};
module.exports = validatorMiddleWare;