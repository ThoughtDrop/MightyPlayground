var messageController = require('./messageController.js');

module.exports = function (app) {
  app.post('/savemessage', messageController.saveMessage);
  app.post('/nearby', messageController.getNearbyMessages);
 	app.post('/updatevote', messageController.updateVote);
  // app.post('/messagedetail', messageController.displayReplies);
  app.post('/private', messageController.savePrivate);
  app.post('/private/nearby', messageController.getPrivate);
  app.post('/addMessageDetail', messageController.addMessageDetail);
};


// private message data: {"_id":10573,
// "location":{"coordinates":[-122.4090845045842,37.78380456384065],"type":"Point"},
// "message":"Private tesT",
// "_creator":"Peter Kim",
// "recipients":[6509225056,5109170484]
// }

// { __v: 0,
// 2015-02-26T23:05:10.926864+00:00 app[web.1]:   _id: 59318,
// 2015-02-26T23:05:10.926866+00:00 app[web.1]:   message: 'Test3',
// 2015-02-26T23:05:10.926868+00:00 app[web.1]:   created_at: Thu Feb 26 2015 23:05:10 GMT+0000 (UTC),
// 2015-02-26T23:05:10.926869+00:00 app[web.1]:   recipients: [],
// 2015-02-26T23:05:10.926870+00:00 app[web.1]:   votes: 0,
//    location: { 
//     coordinates: [ -122.4090845045842, 37.78380456384065 ],
//       type: 'Point' } 
//     }


// Message rawrrr was successfully saved to database { __v: 0,
//   _id: 41835,
//   message: 'rawrrr',
//   created_at: Thu Feb 26 2015 15:17:03 GMT-0800 (PST),
//   recipients: [],
//   votes: 0,
//   location: 
//    { coordinates: [ -122.40912770000001, 37.7837988 ],
//      type: 'Point' } }
     
// Message asdfasdf was successfully saved to database { __v: 0,
//   _id: 74841,
//   message: 'asdfasdf',
//   _creator: 'peter',
//   recipients: [],
//   votes: 0,
//   location: 
//    { coordinates: [ -122.40910160000001, 37.7838443 ],
//      type: 'Point' } }

