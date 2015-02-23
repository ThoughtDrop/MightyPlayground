var Message = require('../../db/models/messages.js');
var Q = require('q');

module.exports = {
  updateVote: function(req, res) {
    console.log('Received updated voteCount from client, where votes = ', req.body.voteCount);
    var updateVote = Q.nbind(Message.findByIdAndUpdate, Message);
    updateVote(req.body.messageID, { votes : req.body.voteCount } );
  },

  getNearby: function(req, res) {
    var findAround = Q.nbind(Message.find, Message);

    var query = {};
    query.location = {
      $near : {
        $geometry : {
          type : "Point",
          coordinates : [req.body[0].long, req.body[0].lat] 
        },
        $maxDistance : 100
      }
    };
    
    findAround(query, function(err, result){
      console.log('Sent messages within 100m of (' + req.body[0].long + ", " + req.body[0].lat + ') to client. Here are the messages:' + result);
      res.sendStatus(result);
    });
  },

  create: function (req, res) {
    var createMessage = Q.nbind(Message.create, Message);

    var data = {
      _id: Math.floor(Math.random()*100000), //change to facebookID

      location: {coordinates: [req.body[1], req.body[2]] },
      message: req.body[0]
    };

    createMessage(data) 
      .then(function (createdMessage) {
        console.log('Message ' + data.message + ' was successfully saved to database');
      })
      .fail(function (error) {
        next(error);
      });
  },
    // - probably replaced by findAround
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