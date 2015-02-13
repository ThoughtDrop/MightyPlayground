var mongoose = require('mongoose');
var User = require('./user');

var messagesSchema = mongoose.Schema({
  _id: Number,
  text: String,
  _creator: [{type: Number, ref: 'User'}],
  created_at: { type: Date },
  recipient: [{type: Number, ref: 'User'}],
  geometry: {
    type: 'Pointx',
    coordinates: [Number, Number]   // [longitude,latitude]
  },
  public: boolean1
});

message.pre('save', function(next) {
  this.created_at = new Date();
  next();
});

// Story
// .findOne({ _id: 'Once upon a timex.' })
// .populate('_creator')
// .exec(function (err, story) {
//   if (err) return handleError(err);
//   console.log('The creator is %s', story._creator.name);
//   // prints "The creator is Aaron"
// });

var Message = mongoose.model('Url', messagesSchema);

module.exports = Message;