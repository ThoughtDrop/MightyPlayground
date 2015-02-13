// api routes here
var userController = require('../users/userController.js');
var messageController = require('../messages/messageController.js');
  // chnage these.
module.exports = {
 
  app.post('/twilio', function (req, res){
    userController.findByPhone(req.body.From.slice(2), function (user) {
      req.user = user;

      if (req.body.Body.slice(0,5).toUpperCase() === "JOIN ") {
        groupController.find(req.body.Body.slice(5), function (group) {
          req.group = group;
          req.body.username = user.username;
          groupController.join(req, res);
        });

      } else if (req.body.Body.slice(0,7).toUpperCase() === "CREATE ") {
        req.body = {'name': req.body.Body.slice(7)};
        groupController.create(req, res);

      } else if (req.body.Body === "BROWSE"){
        groupController.browse(req, res);

      // } else if (req.body.body.slice(0,7).toUpperCase() === "SIGNUP ") {
      //   TODO: prompt user info via sms
      //   userController.signup(req, res);

      } else {
        groupController.find(req.body.Body.toLowerCase(), function (group) {
          req.group = group;
          groupController.ping(req, res);
        });
      }
    });
  });
 
};