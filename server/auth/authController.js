var User = require('../../db/models/user.js');
var Q = require('q');

module.exports = {

  //TODO: maybe somehow modularize this so that it finds in one function, then calls another function when found
  find: function(req, res) {
    console.log('find!');
    console.log('req.body' + JSON.stringify(req.body));
    var findUser = Q.nbind(User.findOne, User);

    findUser({facebookid: req.body.id})   //facebook ID for signin
    .then(function(foundUser) {
      if (foundUser) {
        console.log('foundUser!');
        res.status(200).send('User found, redirecting to stream!');
      }
      if (!foundUser) {
        console.log('User not found!');
        var newUser = {
          facebookid: req.body.id,
          phoneNumber: req.body.phoneNumber,
          name: req.body.name,
          // picture: req.body.picture
        };
        newUser.save();
        // res.status(404).send('Facebookid not found. User saved, now redirect to phone number');
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  savePhoneNumber: function(req, res) {
    var updateUser = Q.nbind(User.update, User);

    updateUser({facebookid: req.body.id})
    .then(function(foundUser) {
      if (foundUser) {
        foundUser._id = req.body.phoneNumber;
        foundUser.save();
      }
    })
    .then(function() {
      res.status(200).send('User found, redirecting to phone number');  
    });
  },

  delete: function(req, res) {
    var findUser = Q.nbind(User.findOne, User);
    
    findUser({facebookid: req.body.facebookid})
    .then(function(foundUser) {
      if (foundUser) {
        foundUser.remove();
        res.status(200).send('User deleted!');  //redirect to facebook login screen
      }
    });
  }
};