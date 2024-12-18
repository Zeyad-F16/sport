const { check } = require('express-validator');
const validatorMiddleWare = require('../../Middlewares/ValidatorMiddleware');

exports.createTeamMemberValidator = [
    check('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min:3 })
    .withMessage('Too short Name'),
    check('title')
    .notEmpty()
    .withMessage('Title is required'),
    check('description')
    .notEmpty()
    .withMessage('description is required'),
    check('profileImage').notEmpty().withMessage('Profile image is required'),
    validatorMiddleWare
    ];


exports.updateTeamMemberValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
        check('name')
            .optional()
            .isLength({ min: 3 })
            .withMessage('Name is too short'),
        check('title')
            .optional()
            .notEmpty()
            .withMessage('Title cannot be empty if provided'),
        check('description')
            .optional()
            .notEmpty()
            .withMessage('Description cannot be empty if provided'),
        check('profileImage')
            .optional()
            .notEmpty()
            .withMessage('Profile image cannot be empty if provided'),
        validatorMiddleWare
];
    
exports.getTeamMemberValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleWare,
];
  
exports.deleteTeamMemberValidator = [
    check('id').isMongoId().withMessage('Invalid ID formate'),
    validatorMiddleWare,
  ];
