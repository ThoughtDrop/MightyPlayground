var morgan = require('morgan'); // used for logging incoming request
var bodyParser = require('body-parser');
var helpers = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations
  var authRouter = express.Router();
  // var userRouter = express.Router();
  var messageRouter = express.Router();
  var clientRouter = express.Router();

  app.use(morgan('dev')); 
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + './../dev'));


  app.use('/api/auth', authRouter); // use user router for all auth request
  // app.use('/api/users', userRouter); // use user router for all user request
  app.use('/api/messages', messageRouter); // use message router for all message requests
  app.use('/api/clients', clientRouter); // use client router for all client request
  
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  // inject our routers into their respective route files
  require('./auth/authRoutes.js')(authRouter);
  // require('./users/userRoutes.js')(userRouter);
  require('./messages/messageRoutes.js')(messageRouter);
  require('./clients/clientRoutes.js')(clientRouter);
};