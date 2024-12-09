const asyncHandler = require('express-async-handler');
const ApiError=require('../utils/ApiError');

exports.createOne = (Model)=>asyncHandler(async(req , res)=>{
const document = await Model.create(req.body);
res.status(201).json({data : document});
});

exports.updateOne = (Model) => asyncHandler(async(req,res,next) => {
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


exports.deleteOne = (Model) => asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    const document = await Model.findByIdAndDelete(id);
                
    if(!document) {
    return next(new ApiError(`No document for this id ${id}`,404))
   }
    
    document.deleteOne()
    res.status(204).send();
 });