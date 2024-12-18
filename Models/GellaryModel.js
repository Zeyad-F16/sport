const mongoose  = require('mongoose');

const GellarySchema = mongoose.Schema({
  title : {type:  String , required : true },
  images :{type : [String] , required : true},
  coverImage :{type : String , required : true},
});

module.exports = mongoose.model('Gellary',GellarySchema);