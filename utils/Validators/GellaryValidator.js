const { check } = require('express-validator');
const validatorMiddleWare = require('../../Middlewares/ValidatorMiddleware');

exports.createGellaryValidator = [
  check('title').notEmpty().withMessage('Title is required'),
  check('coverImage').custom((value, { req }) => {
    if (!req.files || !req.files.coverImage) {
      throw new Error('Cover image is required');
    }
    return true;
  }),
  check('images').custom((value, { req }) => {
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      throw new Error('At least one gallery image is required');
    }
    return true;
  }),
];


exports.updateGellaryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  check('title')
  .optional()
  .notEmpty()
  .withMessage('Title cannot be empty if provided'),
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

exports.getGellaryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleWare,
];


exports.deleteGellaryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleWare,
];
