var mongoose = require('mongoose');
// var keys = require('../keys.js');

// if in production:
mongoose.connect('mongodb://mightyplayground:hr23thesis@ds043991.mongolab.com:43991/mpmongolab');
// mongoose.connect('mongodb://localhost/mightyPlayground');
var db = mongoose.connection;

module.exports = db;