const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp'); 
const factory = require('./handlerFactory');
const {uploadMixOfImages} =require('../Middlewares/uploadImageMiddleware');
const GellaryDB = require('../Models/GellaryModel');

exports.createGellary  = factory.createOne(GellaryDB);

exports.updateGellary = factory.updateOne(GellaryDB);

exports.deleteGellary = factory.deleteOne(GellaryDB);

exports.uploadGellaryImage = uploadMixOfImages(
    [{
      name :  'coverImage' ,
      maxCount : 1
    },
    {
    name : 'images',
    maxCount : 100
    }]
    );

    exports.resizeGellaryImages = asyncHandler(async (req ,res , next)=>{
        if(req.files.coverImage){
        const coverImagefileName = `Gellary-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.coverImage[0].buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`uploads/Gellary/${coverImagefileName}`);
        
         req.body.coverImage = coverImagefileName;
        }
        
        if(req.files.images){
          req.body.images = [];
        await Promise.all(
          req.files.images.map(async(img,index)=>{
          const imageName = `Gellary-${uuidv4()}-${Date.now()}-${index+1}.jpeg`;
        await sharp(img.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`uploads/Gellary/${imageName}`);
        
         req.body.images.push(imageName);
         }))
        }
         next();
});
    

