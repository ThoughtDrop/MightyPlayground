var Message = require('../../db/models/messages.js');
var Q = require('q');

module.exports = {

  updateVote: function(req, res) {
    var voteCount = req.body[1];
    var messageID = req.body[0];
    console.log('Received updated voteCount from client, where votes = ', voteCount);
    var updateVote = Q.nbind(Message.findByIdAndUpdate, Message);
    updateVote(messageID, { votes : voteCount} );
  },

  queryByLocation: function(lat, long, radius) {
    var query = {};
    query.location = {
      $near : {
        $geometry : {
          type : "Point",
          coordinates : [long, lat] 
        },
        $maxDistance : radius
      }
    };
    return query;
  },

  computeSortString: function(sortType) {
    sortType = sortType || '-created_at';
    if (sortType === 'new') {
      sortType = '-created_at'
    } else if (sortType === 'top') {
      sortType = '-votes'
    }
    return sortType;
  },

  getNearbyMessages: function(req, res) {
    var sortString = module.exports.computeSortString(req.body[1]);//pass in 'new' or 'top'
    var locationQuery = module.exports.queryByLocation(req.body[0].lat, req.body[0].long, 100);

    Message
      .find(locationQuery)
      .limit(50) 
      .sort(sortString)
      .exec(function (err, messages) {
        console.log('Sent messages within 100m of (' + req.body[0].lat + ", " + req.body[0].long + ') to client. Here are the messages:' + messages);
        res.send(messages);
    })
  },

  saveMessage: function (req, res) {
    var createMessage = Q.nbind(Message.create, Message);

    var data = { //TODO: add a facebookID field
      _id: Math.floor(Math.random()*100000), 
      location: {coordinates: [req.body[0].long, req.body[0].lat]},
      message: req.body[1],
      created_at: new Date()
    };

    createMessage(data) 
      .then(function (createdMessage) {
        console.log('Message ' + data.message + ' was successfully saved to database', createdMessage);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
 
};