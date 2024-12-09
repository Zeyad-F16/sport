const ApiError = require('../utils/ApiError');

const sendErrorForDev = (err,res)=>
    res.status(err.statusCode).json({
       status : err.status,
       error:err,
       message:err.message,
       stack:err.stack,
   });
   
   const sendErrorForProd = (err,res)=>
   res.status(err.statusCode).json({
       status : err.status,
       message:err.message,
   });
   
   const handleJwtInvalidSignature = ()=> new ApiError('Invalid token , please login again..',401);
   const handleTokenExpiredError = ()=> new ApiError(' Expired token , please login again..',401);
   
   const GlobalError=(err ,req , res , next)=>{
       err.status = err.status || 'error';
       err.statusCode = err.statusCode || 500;
       if(process.env.NODE_ENV==='development'){
       sendErrorForDev(err,res);
       }
       else{
           if(err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
           if(err.name === 'TokenExpiredError') err = handleTokenExpiredError();
           sendErrorForProd(err,res);
       }};
   
module.exports = GlobalError;