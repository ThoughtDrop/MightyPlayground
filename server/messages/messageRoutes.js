var messageController = require('./messageController.js');

module.exports = function (app) {
  app.post('/savemessage', messageController.saveMessage);
  app.post('/nearby', messageController.getNearbyMessages);
 	app.post('/updatevote', messageController.updateVote);
  // app.post('/messagedetail', messageController.displayReplies);
  app.post('/private', messageController.savePrivate);
  app.post('/private/nearby', messageController.getPrivate);
  app.post('/addreply', messageController.addReply);
  // app.post('/saveimage', messageController.saveImage);
  // app.post('/messagedetail', messageController.displayReplies);
};
