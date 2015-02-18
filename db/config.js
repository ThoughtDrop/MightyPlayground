var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mightyPlayground');
var db = mongoose.connection;

module.exports = db;
