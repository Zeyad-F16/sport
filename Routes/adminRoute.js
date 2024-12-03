const express = require('express');
const secertKey = require('../Controllers/SecretKeyService');
const Signup = require('../Controllers/AdminSignup');
const validateSignupToken = require('../Middlewares/validateToken');

const router = express.Router();

router.post('/validate-secert', secertKey);

router.post('/signup' , validateSignupToken ,Signup);

module.exports = router;