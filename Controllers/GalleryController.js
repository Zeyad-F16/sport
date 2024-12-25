const factory = require('./handlerFactory');
const GalleryDB = require('../Models/GalleryModel');
const upload = require('../config/multer');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const extractPublicId = require('../utils/getImageId');
const ApiError = require('../utils/ApiError');

// Get all galleries
// access : Public
exports.getAllGallery  = factory.getAll(GalleryDB);

// Get one gallery
// access : Public
exports.getOneGallery  = factory.getOne(GalleryDB);

// Create a gallery
exports.createGallery  = factory.createOne(GalleryDB);

// Update a gallery
exports.updateTextData = factory.updateTextData(GalleryDB);

//  Delete a gallery
exports.deleteSingleImage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // Find the document by ID
  const document = await GalleryDB.findById(id);
  if (!document) {
    return next(new ApiError(`No document found for this id ${id}`, 404));
  }
  
  // Check if the request contains the image to delete
  if (!req.body.gallery) {
    return next(new ApiError(`Image to delete is required`, 400));
  }
  
  const imageToDelete = req.body.gallery;
  
  // Ensure the image exists in the gallery array
  if (!document.images.includes(imageToDelete)) {
    return next(new ApiError(`Image not found in the gallery`, 404));
  }
  
  // Remove the image from the gallery array
  document.images = document.images.filter((img) => img !== imageToDelete);
  
  // Delete the image from Cloudinary
  const publicId = extractPublicId(imageToDelete);
  await cloudinary.uploader.destroy(publicId);
  
  // Save the updated document
  await document.save();
  
  res.status(200).json({ data: document });
});  

// Delete a gallery document
exports.deleteGallery = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  // Find the document by ID
  const document = await GalleryDB.findById(id);
  if (!document) {
    return next(new ApiError(`No document found for this id ${id}`, 404));
  }
  
  // Delete all images in the 'gallery' array from Cloudinary
  if (document.images && Array.isArray(document.images)) {
    for (const image of document.images) {
      const publicId = extractPublicId(image);
      await cloudinary.uploader.destroy(publicId);
    }
  }
  
  // Delete the coverImage from Cloudinary (if it exists)
  if (document.coverImage) {
    const publicId = extractPublicId(document.coverImage);
    await cloudinary.uploader.destroy(publicId);
  }
  
  // Save the updated document
  await document.deleteOne();
  res.status(204).send();
});


// Middleware for handling both cover and gallery images
exports.uploadGalleryImagesMiddleware = upload.fields([
  { name: 'images', maxCount: 100 },
]);

// Middleware for updating the cover image
exports.updateSingleImage  = factory.updateSingleImage(GalleryDB , "coverImage");

// Middleware for handle the cover image
exports.handleSingleFileUpload = factory.handleSingleFileUpload("coverImage");

// Middleware for uploading the cover image
exports.uploadCoverImageMiddleware = upload.single('coverImage');

// Middleware for updating the gallery to add new images
exports.updateToAddNewImages = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const document = await GalleryDB.findById(id);
  if (!document) {
    return next(new ApiError(`No document found for this id ${id}`, 404));
  }
  
  document.images = [...document.images, ...req.body.images];
  await document.save();
  
  res.status(200).json({ data: document });
});

// Middleware for handling multiple images
exports.handleFileUploads = (req, res, next) => {
  req.body.images = req.files.images.map((file) => file.path);
  next();
};