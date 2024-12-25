const factory = require('./handlerFactory');
const TeamMemberDB = require('../Models/TeamMemberModel');
const upload = require('../config/multer');
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const extractPublicId = require('../utils/getImageId');

// Get all team members
// access : Public
exports.getAllTeamMembers  = factory.getAll(TeamMemberDB);

// Get one team member
// access : Public
exports.getOneTeamMember  = factory.getOne(TeamMemberDB);

// Create a team member
exports.createTeamMember  = factory.createOne(TeamMemberDB);

// Update a team member
exports.updateTextData  = factory.updateTextData(TeamMemberDB);

// Update profile image
exports.updateProfileImage  = factory.updateSingleImage(TeamMemberDB , "profileImage");

// Middleware for uploading profile image
exports.uploadProfileImage = upload.single("profileImage");

// Handle single file upload
exports.handleSingleFileUpload = factory.handleSingleFileUpload("profileImage");

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