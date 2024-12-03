const mongoose  = require('mongoose');

const GellarySchema = mongoose.Schema({
  year : {type:  Number , required : true },
  images :{type : [String] , required : true},
  coverImage :{type : String , required : true},
});

module.exports = mongoose.model('Gellary',GellarySchema);