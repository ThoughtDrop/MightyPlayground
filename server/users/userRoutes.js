var userController = require('./userController.js');

module.exports = function (app) {
  // app === userRouter injected from middlware.js
    //change all this to work
  // app.param('user', userController.parseUserUrl);

  app.post('/signup', userController.signup);
  app.post('/signin', userController.signin);

};