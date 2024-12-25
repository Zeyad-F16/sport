const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const extractPublicId = require('../utils/getImageId');
const cloudinary = require('cloudinary').v2;

// Get all documents
exports.getAll = (Model)=>asyncHandler(async(req, res , next)=>{
const document = await Model.find();
res.status(200).json({
    results: document.length ,
    data : document      
   });
});

// Get one document
exports.getOne = (Model)=>asyncHandler(async(req, res ,next)=>{
  const {id} = req.params;

  const document = await Model.findById(id);

  if (!document) {
    return next(new ApiError(`No document found with id ${id}`, 404));
}

res.status(200).json({ data: document });
});

// Create a document
exports.createOne = (Model)=>asyncHandler(async(req , res)=>{
const document = await Model.create(req.body);
res.status(201).json({data : document});
});

// Update a document
exports.updateTextData = (Model) => asyncHandler( async(req,res,next) => {
  const document = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true});
   
      if(!document) {
          return next(new ApiError(`No document for this id ${req.params.id}`,404))
  }
  
  document.save();
  res.status(200).json({data : document});
});

//  Update single image
exports.updateSingleImage = (Model, imageName) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Find the document by ID
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document found for this id ${id}`, 404));
    }

    // Check if the request contains the new image
    if (!req.body[imageName]) {
      return next(new ApiError(`${imageName} is required`, 400));
    }

    // Handle existing image cleanup
    if (document[imageName]) {
      const publicId = extractPublicId(document[imageName]);
      await cloudinary.uploader.destroy(publicId);
    }

    // Update the image field dynamically
    document[imageName] = req.body[imageName];
    await document.save();

    res.status(200).json({ data: document });
  });

  // handle single image upload
  exports.handleSingleFileUpload = (imageName) => (req, res , next) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    req.body[imageName] = req.file.path;
    next();
  };