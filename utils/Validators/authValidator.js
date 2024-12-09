const { check } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleWare = require('../../Middlewares/ValidatorMiddleware');
const AdminDB = require('../../Models/AdminModel');

exports.signupValidator = [
    check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min:3 })
    .withMessage('Too short Name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email address')
    .custom((val)=>
    AdminDB.findOne({ email:val }).then((user) => {
      if(user){
      return Promise.reject(new Error('Email already in use'));
      }
    })
    ),
    check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min:6})
    .withMessage('Password must be at least 6 characters')
    .custom((password,{req})=>{
      if(password !== req.body.passwordConfirm){
        throw new Error('Password confirmation incorrect');
      }
      return true;
    }),
    check('passwordConfirm')
    .notEmpty()
    .withMessage('password confirmation required'), 
    validatorMiddleWare
    ];


exports.loginValidator = [
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email address'),
    check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min:6})
    .withMessage('Password must be at least 6 characters'), 
    validatorMiddleWare
    ];
