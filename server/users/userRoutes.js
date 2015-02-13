var userController = require('./userController.js');

module.exports = function (app) {
  // app === userRouter injected from middlware.js
    //change all this to work
  app.param('user', userController.parseUserUrl);

  app.get('/', userController.browse);
  app.post('/', userController.signup);

  app.get('/:user/groups', userController.groups);
};