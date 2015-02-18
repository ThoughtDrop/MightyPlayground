var mongoose = require('mongoose');
var Message = require('./messages');

var usersSchema = new mongoose.Schema({
  _id: {type: Number, min: 9, max: 9}, //phone number
  facebookid: {type: String}
  // messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

var User = mongoose.model('User', usersSchema);
module.exports = User;
