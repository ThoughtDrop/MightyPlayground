var Auth = require('../../db/models/user.js');

module.exports = {

  findUser: function(req, res) {
    User
    .findOne({facebookid: req.body.facebookid})   //facebook ID for signin
    .exec(function (err, foundUser) {
      console.log(foundUser);
      if (err) {
        throw err;
      }
      if (foundUser) {
        res.status(200).send('User found, redirecting to stream!');
      }
      if (!foundUser) {
        var newUser = {
          facebookid: req.body.facebookid
          //add first name
          //add last name
        };
        newUser.save();
        res.status(404).send('Facebookid not found. User saved, now redirect to phone number');
      }
    });
  },

  getPhoneNumber: function(req, res) {
    User
    .update({facebookid: req.body.facebookid}, {
      _id: req.body.phoneNumber
    }, function(err, numberAffected, rawReponse) {
        res.status(200).send('User found, redirecting to phone number');
      }
    );
  }
};