var messageController = require('./messageController.js');

module.exports = function (app) {
  app.post('/savemessage', messageController.saveMessage);
  app.post('/nearby', messageController.getNearbyMessages);
 	app.post('/updatevote', messageController.updateVote);
  app.post('/messagedetail', messageController.displayReplies);
};
