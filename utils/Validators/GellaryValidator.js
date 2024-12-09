const { check } = require('express-validator');
const validatorMiddleWare = require('../../Middlewares/ValidatorMiddleware');

exports.createGellaryValidator = [
    check('year')
    .notEmpty()
    .withMessage('Year is required')
    .isNumeric()
    .withMessage('Year must be a number')
    .isLength({ max: 4 })
    .withMessage('To long price'),
    check('coverImage').notEmpty().withMessage('Gellary Cover image is required'),
    check('images')
      .notEmpty()
      .withMessage('images is required')
      .isArray()
      .withMessage('images should be array of string')
      .isLength({min : 1})
      .isLength({max : 100}),
    validatorMiddleWare,
];


exports.updateGellaryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  check('year')
    .optional()
    .isNumeric()
    .withMessage('Year must be a number')
    .isLength({ max: 4 })
    .withMessage('Year must not exceed 4 digits'),
  check('coverImage')
    .optional()
    .notEmpty()
    .withMessage('Gallery Cover image must not be empty if provided'),
  check('images')
    .optional()
    .isArray()
    .withMessage('Images should be an array')
    .custom((images) => {
      if (images && (images.length < 1 || images.length > 100)) {
        throw new Error('Images array must contain between 1 and 100 items');
      }
      return true;
    }),

  validatorMiddleWare,
];


exports.deleteGellaryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleWare,
];
