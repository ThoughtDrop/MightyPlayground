var messageController = require('./messageController.js');

module.exports = function (app) {

  app.get('/', messageController.fetch);
  app.post('/', messageController.create);
  app.get('/nearby', messageController.findAround);

};
