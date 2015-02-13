var mongoose = require('mongoose');
var Message = require('./messages');

var usersSchema = new mongoose.Schema({
  _id: {type: number, min: 9, max: 9},
  messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
});

// var rob = new User({_id: 9175202524});
// var peter = new User({_id: 111111111});

// rob.save(function(err) {
//   if (err) return handleError(err);

//   var message1 = new Message({
//     text: 'hello',
//     _creator: rob._id,
//     // created_at: { type: Date },
//     // recipient: [{type: Number, ref: 'User'}],
//     // geometry: {
//     //   type: 'Point',
//     //   coordinates: [Number, Number]
//     // },
//     public: true
//   });
  
//   message1.save(function(err) {
//     if (err) return handleError(err);
//   });
// });

// usersSchema.methods.comparePassword = function(attemptedPassword, callback) {
//   bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
//     callback(isMatch);
//   });
// };

// usersSchema.methods.hashPassword = function(next){
//   var user = this;
//   bcrypt.genSalt(10, function(error, result) {
//     user.set('salt', result);
//     bcrypt.hash(user.get('password'), user.get('salt'), null, function(error, res) {
//       console.log('got into hash');
//       user.set('password', res);
//       next();
//     });
//   });
// };

// usersSchema.pre('save', function(next) {
//   this.hashPassword(next);
//   console.log(this.password);
// });


var User = mongoose.model('User', usersSchema);
module.exports = User;

// var newUser = new User({username: 'a', password: '123', salt: 'salt'});
// newUser.save(function(err, user) {
//   if (err) { console.log(err); }
//     else { console.log('saved!'); }

// });