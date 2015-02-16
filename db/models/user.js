var mongoose = require('mongoose');
var Message = require('./messages');

var usersSchema = new mongoose.Schema({
  _id: {type: number, min: 9, max: 9}, //phone number
  facebookid: {type: STRING}
  // messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
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