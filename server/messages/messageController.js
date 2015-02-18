var Message = require('../../db/models/messages.js');
var Q = require('q');

module.exports = {

  findAround: function(req, res) {
    var findAround = Q.nbind(Message.find, Message);
    console.log(req.body.long, req.body.lat);

    var query = {};
    query.location = {
      $near : {
        $geometry : {
          type : "Point",
          coordinates : [req.body.long, req.body.lat] 
        },
        $maxDistance : 100
      }
    };
    Message.find(query, function(err, result){
      console.log('DATABASE RESULT', result);
      res.send(result);
      // res.json(result);
    });
  },

  create: function (req, res) {
    var createMessage = Q.nbind(Message.create, Message);

    var data = {
      _id: Math.floor(Math.random()*100000), //change to facebookID
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