const mongoose  = require('mongoose');

const GallerySchema = mongoose.Schema({
  title : {type:  String , required : true },
  description: String,
  images : [String] ,
  coverImage :{type : String , required : true},
});

module.exports = mongoose.model('Gallery',GallerySchema);