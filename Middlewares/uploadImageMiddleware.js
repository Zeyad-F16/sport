const multer  = require('multer');
const ApiError = require('../utils/ApiError');

const multerOptions = ()=>{
    const multerStorage = multer.memoryStorage();
    const multerFilter =  function(req, file , cb) {
        if(file.mimetype.startsWith('image')){
            cb(null ,true)
        }
        else{
            cb(new ApiError('only images Allowed',400),false);
        }
    }
    const upload = multer({storage: multerStorage  , fileFilter : multerFilter});
    return upload;
}

exports.uploadSingleImage = (fileName) =>  multerOptions().single(fileName);
exports.uploadMixOfImages = (arrayOfFields)=> multerOptions().fields(arrayOfFields);
