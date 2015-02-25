var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');
// var keys = require('../keys.js');

if (process.env.PORT) {
  // mongoose.connect('mongodb://' + process.env.mongolabsuser + ':' + process.env.mongolabspassword + '@ds043991.mongolab.com:43991/mpmongolab');
  mongoose.connect('mongodb://' + 'mightyplayground' + ':' + 'hr23thesis' + '@ds043991.mongolab.com:43991/mpmongolab');
} else {
  mongoose.connect('mongodb://localhost/mightyPlayground');
}

//autoIncrement.initialize(mongoose.connection);
var message = require('./models/messages');
var user = require('./models/user');
var db = mongoose.connection;
module.exports = db;