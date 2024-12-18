const factory = require('./handlerFactory');
const TeamMemberDB = require('../Models/TeamMemberModel');
const upload = require('../config/multer');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const extractPublicId = require('../utils/getImageId');

exports.getAllTeamMembers  = factory.getAll(TeamMemberDB);

exports.getOneTeamMember  = factory.getOne(TeamMemberDB);

exports.createTeamMember  = factory.createOne(TeamMemberDB);

exports.updateNonImages  = factory.updateNonImages(TeamMemberDB);

exports.updateSingleImage  = factory.updateSingleImage(TeamMemberDB , "profileImage");

// delete team member
exports.deleteTeamMember = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  const document = await TeamMemberDB.findById(id);
  
  if (!document) {
    return next(new ApiError(`No document found for this id ${id}`, 404));
  }
  
  // Extract Cloudinary public_id from the image URL
  if (document.profileImage) {
    const publicId = extractPublicId(document.profileImage);
    await cloudinary.uploader.destroy(publicId);
  }
  
  await document.deleteOne();
  res.status(204).send();
});

// Middleware for uploading profile image
exports.uploadMiddleware = upload.single('profileImage');

exports.handleSingleFileUpload = (req, res , next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  req.body.profileImage = req.file.path;
  next();
};