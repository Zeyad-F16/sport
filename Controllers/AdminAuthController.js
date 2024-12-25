const asynchandler = require('express-async-handler');
const crypto = require('crypto');
const AdminDB = require('../Models/AdminModel');
const bcrypt = require('bcryptjs');
const CreateToken = require('../utils/CreateToken');
const ApiError = require('../utils/ApiError');
const JWT = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const {sanitizeAdminData} = require('../utils/sanitizeData');

// @desc    Admin Signup 
// @route   POST /assiutmotorsport/api/admin/signup
// @access  Private/Access only for those who entered the secret key correctly
exports.Signup = asynchandler(async(req , res)=>{   
    const Admin = await AdminDB.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    });   
   
   const token = CreateToken(Admin._id);
   res.status(201).json({data: sanitizeAdminData(Admin) , token});
});

// @desc    Admin login 
// @route   POST /assiutmotorsport/api/admin/login
// @access  Private/Access only for Admins
exports.login = asynchandler(async(req , res , next)=>{
    const Admin = await AdminDB.findOne({email : req.body.email});
    
    if(!Admin || !(await bcrypt.compare(req.body.password , Admin.password))){
        return next(new ApiError('Incorrect email or password',401));
    }
    
    const token = CreateToken(Admin._id);
    res.status(200).json({data : Admin , token});
});


// @desc make sure the user is logged in 
exports.protect = asynchandler(async (req, res, next) => {
  // check if token exists 
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError('Not authenticated. Please log in to access this route.', 401));
  }

 // verify token that check token is not expired and no changes happened
 const decoded = JWT.verify(token, process.env.JWT_SECRET);
  
 // check if Admin exists
  const Admin = await AdminDB.findById(decoded.adminId);
  if (!Admin) {
    return next(new ApiError('The user belonging to this token no longer exists.', 401));
  }

  // check if Admin change his password after token created
  if (Admin.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(Admin.passwordChangedAt.getTime() / 1000, 10);
    if (decoded.iat < passwordChangedTimestamp) {
      return next(new ApiError('User recently changed password. Please log in again.', 401));
    }
  }

  req.admin = Admin;
  next();
});


exports.forgetPassword = asynchandler(async(req, res, next)=>{
    const Admin = await AdminDB.findOne({ email: req.body.email});
    if (!Admin) {
      return next( new ApiError(`There is no Admin for this email ${req.body.email}`,404));
    }
    // if Admin is exist , generate random 6 digits and save it in db 
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex');
  
  // save hashedResetCode in db
  Admin.passwordResetCode = hashedResetCode;
  
  // add expiration time for password reset code (10 minutes)
  Admin.passwordResetExpires = Date.now() + 10 *60 * 1000 ; 
  Admin.passwordResetVerified = false;
  await Admin.save();
  
  // 3- send the reset code via email
  const message =`Hi ${Admin.name},\nWe got a request to reset your password \n ${resetCode} \nEnter this code to reset \nThanks`;
  
   try{
    await sendEmail({
      email:Admin.email,
      subject: 'Your password reset code valid for 10 minutes ',
      message,
      });
   }
   catch (err) {
    Admin.passwordResetCode = undefined;
    Admin.passwordResetExpires = undefined;
    Admin.passwordResetVerified = undefined;
  
    Admin.save();
    return next( new ApiError('there is an error in sending email',500));
   }
  
  res.status(200).json({status: 'success' ,message : 'Reset code send to Email'});
  });


  exports.verifyPasswordResetCode = asynchandler(async(req, res ,next)=>{
    // 1- Get admin based on reset code
    const hashedResetCode = crypto
    .createHash('sha256')
    .update(req.body.resetCode)
    .digest('hex');
   
   const Admin  = await AdminDB.findOne({
     passwordResetCode : hashedResetCode,
     passwordResetExpires :{ $gt : Date.now() },
   });
   
   if (!Admin) {
     return next( new ApiError('Reset code invalid or expired',404));
   }
   
   Admin.passwordResetVerified = true;
   
   await Admin.save();
   
   res.status(200).json({
     status: 'success',
   })
   
   });


exports.resetPassword = asynchandler(async(req, res, next)=>{
    //  Get Admin based on email
    const Admin = await AdminDB.findOne({ email: req.body.email});
    if (!Admin) {
      return next(new ApiError(`There is no Admin for this email ${req.body.email}`,404));
    }
    
    // check if reset code verified
    if(!Admin.passwordResetVerified){
    return next(new ApiError('Reset code not verified',400));
    }
    
    Admin.password = req.body.newPassword ;
    Admin.passwordChangedAt = Date.now();
    Admin.passwordResetCode = undefined;
    Admin.passwordResetExpires = undefined;
    Admin.passwordResetVerified = undefined;
    
    await Admin.save();
    
    // if everything is ok , generate token
    const token = CreateToken(Admin._id);
    
      res.status(200).json({token});
});