var authController = require('./authController.js');

module.exports = function (app) {

  app.post('/', authControllerController.findUser); 
  app.delete('/', authControllerController.delete);
  app.post('/phone', authControllerController.getPhoneNumber);
};
