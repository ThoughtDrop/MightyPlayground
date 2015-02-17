var authController = require('./authController.js');

module.exports = function (app) {

  app.post('/', authController.find); 
  app.delete('/', authController.delete);
  app.post('/phone', authController.savePhoneNumber);
};
