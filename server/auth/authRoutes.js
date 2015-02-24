var authController = require('./authController.js');

module.exports = function (app) {

  app.post('/id', authController.find); 
  app.delete('/', authController.delete);
};