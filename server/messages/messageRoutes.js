var messageController = require('./messageController.js');

module.exports = function (app) {

  app.get('/', messageController.fetch);
  app.post('/', messageController.create);
  app.post('/nearby', messageController.getNearby);
 	app.post('/votes', messageController.updateVote);
};
