var User = require('../../db/models/user.js');
var Message = require('../../db/models/messages.js');

  //these need to be changed as they are for SQL
module.exports = {
  login: function(req, res) {
    User
      .findOne({fbid: req.body.fbid})
      .exec(function (err, foundUser) {
        if (err) {
          throw err;
        }
        if (!foundUser) {
          var newUser = {
            fbid: req.body.fbid,
            firstName: req.body.first_name,
            last_name: req.body.last_name
          };

          
        }
      })
  },

  signup: function() {

  }
  
};