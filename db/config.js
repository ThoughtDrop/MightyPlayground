var mongoose = require('mongoose');
var keys = require('../keys.js');

// if in production:
mongoose.connect('mongodb://' + keys.mongolabs.dbuser + ':' + keys.mongolabs.dbpassword + '@ds043991.mongolab.com:43991/mpmongolab');
// mongoose.connect('mongodb://localhost/mightyPlayground');
var db = mongoose.connection;

module.exports = db;