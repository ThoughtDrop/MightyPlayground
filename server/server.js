var express = require('express');
var mongoose = require('mongoose');
var db = require('../db/config.js');

var app = express();

server.listen(process.env.PORT || 3000, function () {
    console.log("Server started @ ", process.env.PORT || 3000);
});

app.listen(port);
console.log('Server now listening on port ' + port);

// configure server with middleware and routing
require('./middleware.js')(app, express);

// export app for testing and flexibility
module.exports = app;