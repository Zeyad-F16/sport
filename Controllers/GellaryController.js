const factory = require('./handlerFactory');
const GellaryDB = require('../Models/GellaryModel');
const upload = require('../config/multer');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const extractPublicId = require('../utils/getImageId');
const ApiError = require('../utils/ApiError');

exports.getAllGellary  = factory.getAll(GellaryDB);

exports.getOneGellary  = factory.getOne(GellaryDB);

exports.createGellary  = factory.createOne(GellaryDB);

exports.updateNonImages = factory.updateNonImages(GellaryDB);

exports.updateSingleImage  = factory.updateSingleImage(GellaryDB , "coverImage");

exports.updateToAddNewImages = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await GellaryDB.findById(id);
    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }

    if (!req.body.images || !Array.isArray(req.body.images)) {
      return next(new ApiError(' images must be an array of images', 400));
    }

    document.images = [...document.images, ...req.body.images];
    await document.save();

    res.status(200).json({ data: document });
  });


  exports.deleteSingleImage = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    // Find the document by ID
    const document = await GellaryDB.findById(id);
    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }
  
    // Check if the request contains the image to delete
    if (!req.body.gellary) {
      return next(new ApiError(`Image to delete is required`, 400));
    }
  
    const imageToDelete = req.body.gellary;
  
    // Ensure the image exists in the gellary array
    if (!document.images.includes(imageToDelete)) {
      return next(new ApiError(`Image not found in the gellary`, 404));
    }
  
    // Remove the image from the gellary array
    document.images = document.images.filter((img) => img !== imageToDelete);
  
    // Delete the image from Cloudinary
    const publicId = extractPublicId(imageToDelete);
    await cloudinary.uploader.destroy(publicId);
  
    // Save the updated document
    await document.save();
  
    res.status(200).json({ data: document });
  });  
  
  
  exports.deleteGallery = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    // Find the document by ID
    const document = await GellaryDB.findById(id);
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
  
    // Delete the 'coverImage' from Cloudinary (if it exists)
    if (document.coverImage) {
      const publicId = extractPublicId(document.coverImage);
      await cloudinary.uploader.destroy(publicId);
    }
  
    // Save the updated document
    await document.deleteOne();
  res.status(204).send();
  });
  
  
  // Middleware for handling both cover and gallery images
exports.uploadGellaryImagesMiddleware = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 100 },
  ]);
  
  exports.handleFileUploads = (req, res, next) => {
    if (!req.files || (!req.files.coverImage && !req.files.images)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
  
    if (req.files.coverImage && req.files.coverImage.length > 0) {
      req.body.coverImage = req.files.coverImage[0].path; 
    }
  
    if (req.files.images && req.files.images.length > 0) {
      req.body.images = req.files.images.map((file) => file.path);
    }
  
    next();
  };