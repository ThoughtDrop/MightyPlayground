var messageController = require('./messageController.js');

module.exports = function (app) {
  // app is injected from middlware.js
    //change these later
  // app.param('group', groupController.parseGroupUrl);

  app.get('/messages', messageController.fetch);
  app.post('/messages', messageController.create);

  // app.get('/:group', messageController.members);
  // app.post('/:group', messageController.join);

  // app.get('/:group/pings/', messageController.history); //: means variable
  // app.post('/:group/pings/', messageController.ping);
};
