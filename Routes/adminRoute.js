const express = require('express');

const secertKey = require('../Controllers/SecretKeyController');

const {          Signup ,
                  login ,
         forgetPassword , 
verifyPasswordResetCode ,
           resetPassword} = require('../Controllers/AdminAuthController');

const validateSecretKeyToken = require('../Middlewares/validateSecretKeyToken');

const {signupValidator , loginValidator } = require('../utils/Validators/authValidator');

const router = express.Router();

router.post('/validate-secert', secertKey);

router.post('/signup' , validateSecretKeyToken ,signupValidator ,Signup);

router.post('/login' , loginValidator ,login);

router.post('/forgetPassword' , forgetPassword);

router.post('/verifyPasswordResetCode' , verifyPasswordResetCode);

router.put('/resetPassword' , resetPassword);

module.exports = router;