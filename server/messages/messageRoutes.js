var messageController = require('./messageController.js');

module.exports = function (app) {
  app.post('/savemessage', messageController.saveMessage);
  app.put('/getsignedurl', messageController.getSignedUrl);
 	app.post('/updatevote', messageController.updateVote);
  app.post('/nearby', messageController.getNearbyMessages);
  app.post('/addreply', messageController.addReply);
  app.post('/private', messageController.savePrivate);
  app.post('/private/nearby', messageController.getPrivate);
  app.post('/private/addreply', messageController.addPrivateReply);
};
