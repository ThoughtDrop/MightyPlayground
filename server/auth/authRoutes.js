var authController = require('./authController.js');

module.exports = function (app) {

  app.get('/', authControllerController.findUser);

};
