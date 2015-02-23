var mongoose = require('mongoose');
var Message = require('./messages');

var usersSchema = new mongoose.Schema({
  _id: Number,//phone number
  facebookid: Number,
  phoneNumber: {type: Number, min: 10, max: 10},
  name: String
  // messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

var User = mongoose.model('User', usersSchema);
module.exports = User;
