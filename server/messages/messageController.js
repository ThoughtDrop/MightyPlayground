var Message = require('../../db/models/messages.js');
var Q = require('q');
module.exports = {


  findAround: function(req, res) {
    console.log('invoke messagesController findAround');
    // var findAround = Q.nbind(Message.find, Message);
    var query = {};
    query.location = {
      $near : {
        $geometry : {
          type : "Point",
          coordinates : [-122.408995, 37.783624]
        },
        $maxDistance : 100
      }
    };
    Message.find(query, function(err, result){
      console.log("error: " + err);
      console.log(result);
      res.send(result);
    });

    // findAround({location : {
    //   $near : {
    //     $geometry : {
    //       type : 'Point',
    //       coordinates : [37.783624, -122.408999]
    //     },
    //     $maxDistance : 1000
    //     }
    //   }
    // })
      // .then(function (messages) {
      //   res.send(messages);
      //   console.log('hello');
      // })
      // .fail(function (error) {
      //   console.log(error);
      //   next(error);
      // });
  },


  create: function (req, res) {
    console.log('latitude ' + req.body.lat);
    console.log('latitude ' + req.body.long);
    console.log('latitude ' + req.body.message);
    // console.dir('long ' + req.body.$$state.value.coords.longitude);

    // console.log(req.body);
    var createMessage = Q.nbind(Message.create, Message);

    var data = {
      _id: Math.floor(Math.random()*100000),
      location: {coordinates: [req.body.long, req.body.lat] },
      // radius: req.body.radius,
      // created_by: req.body.created_by,
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