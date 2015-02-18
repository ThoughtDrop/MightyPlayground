var Message = require('../../db/models/messages.js');
var Q = require('q');
module.exports = {

  findAround: function(req, res) {
    // var findAround = Q.nbind(Message.find, Message);
    var query = {};
    query.location = {
      $near : {
        $geometry : {
          type : "Point",
          coordinates : [-122.408995, 37.783624] //TODO - modify to use own coordinates on app open
        },
        $maxDistance : 100
      }
    };
    Message.find(query, function(err, result){
      res.send(result);
    });
  },

  create: function (req, res) {
    var createMessage = Q.nbind(Message.create, Message);

    var data = {
      _id: Math.floor(Math.random()*100000),
      location: {coordinates: [req.body.long, req.body.lat] },
      message: req.body.message
    };

    createMessage(data) 
      .then(function (createdMessage) {
        res.send('saved message!');
      })
      .fail(function (error) {
        next(error);
      });
  },
    //TODO - probably replaced by findAround
  fetch: function(req, res) {
    var findAll = Q.nbind(Message.find, Message);

    findAll({})
      .then(function (messages) {
        res.json(messages);
      })
      .fail(function (error) {
        next(error);
      });
  }
};