const { check } = require('express-validator');
const validatorMiddleWare = require('../../Middlewares/ValidatorMiddleware');

exports.createGalleryValidator = [
  check('title').notEmpty().withMessage('Title is required'),
  check('description')
    .optional()
    .notEmpty()
    .withMessage('Description cannot be empty if provided'),
  check('coverImage').notEmpty().withMessage('Cover image is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('At least one gallery image is required'),
  validatorMiddleWare,
];

exports.updateGalleryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  check('title')
  .optional()
  .notEmpty()
  .withMessage('Title cannot be empty if provided'),
  check('description')
        .optional()
        .notEmpty()
        .withMessage('Description cannot be empty if provided'),
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

exports.getGalleryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleWare,
];


exports.deleteGalleryValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleWare,
];
