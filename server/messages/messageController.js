var Message = require('../../db/models/messages.js');
var Q = require('q');

module.exports = {

  create: function (req, res) {
    var createMessage = Q.nbind(Message.create, Message);

    var data = {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      radius: req.body.radius,
      created_by: req.body.created_by
    };

    console.log(data);

    createMessage(data) 
      .then(function (createdMessage) {
        res.send('saved message!');
      })
      .fail(function (error) {
        next(error);
      });


  },
    //this gets all data points for now. Will have to refactor once we know how the db will work.
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