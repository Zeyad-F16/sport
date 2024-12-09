const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp'); 
const factory = require('./handlerFactory');
const {uploadSingleImage} =require('../Middlewares/uploadImageMiddleware');
const TeamMemberDB = require('../Models/TeamMemberModel');

exports.createTeamMember  = factory.createOne(TeamMemberDB);

exports.updateTeamMember = factory.updateOne(TeamMemberDB);

exports.deleteTeamMember = factory.deleteOne(TeamMemberDB);

exports.uploadTeamMemberImage = uploadSingleImage('profileImage');

exports.resizeImage = asyncHandler(async (req ,res , next)=>{
    const fileName = `TeamMember-${uuidv4()}-${Date.now()}.jpeg`;
    if(req.file){
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/TeamMember/${fileName}`);
    
    req.body.profileImage = fileName;
}
     next();
 });
