var authController = require('./authController.js');

module.exports = function (app) {

  app.get('/', authController.findUser);

};
