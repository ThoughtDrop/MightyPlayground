var User = require('../../db/models/user.js');
var Q = require('q');

module.exports = {

  //TODO: maybe somehow modularize this so that it finds in one function, then calls another function when found
  find: function(req, res) {
    console.log('find!');
    console.log('req.body' + JSON.stringify(req.body));
    var findOne = Q.nbind(User.findOne, User);

    findOne({ _id: req.body._id})
      .then(function(user) {
        if(!user) {
          var create = Q.nbind(User.create, User);
          newUser = {
            _id: req.body._id, //user phoneNumber
            fbID: req.body.fbID, 
            name: req.body.name,
            picture: req.body.picture.data.url
          };
          res.send(200);
          return create(newUser);
        }
        if(user) {
          res.send(200);
        }
      })
      .catch(function (error) {
        console.log('error: ' + error);
        next(error);
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