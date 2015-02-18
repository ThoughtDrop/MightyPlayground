var mongoose = require('mongoose');
var User = require('./user');

var messagesSchema = new mongoose.Schema({
  _id: Number,
  // _creator: [{type: Number, ref: 'User'}],
  // created_at: { type: Date },
  // recipient: [{type: Number, ref: 'User'}],
  location : {
    type: { 
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  // public: boolean,
  message: String
});

messagesSchema.index({ location : '2dsphere' });

var Message = mongoose.model('Message', messagesSchema);

// Message.create({
//       _id: Math.floor(Math.random()*100000),
//       location: {coordinates: [-122.408994, 37.783624] },
//       message: 'hr1'
//     });

// Message.create({
//       _id: Math.floor(Math.random()*100000),
//       location: {coordinates: [-122.408995, 37.783624] },
//       message: 'hr2'
//     });

// Message.create({
//       _id: Math.floor(Math.random()*100000),
//       location: {coordinates: [-122.408996, 37.783624] },
//       message: 'hr3'
//     });

// Message.create({
//       _id: Math.floor(Math.random()*100000),
//       location: {coordinates: [0, 0] },
//       message: 'Africa'
//     });

// message.pre('save', function(next) {
//   this.created_at = new Date();
//   next();
// });

// Story
// .findOne({ _id: 'Once upon a timex.' })
// .populate('_creator')
// .exec(function (err, story) {
//   if (err) return handleError(err);
//   console.log('The creator is %s', story._creator.name);
//   // prints "The creator is Aaron"
// });


module.exports = Message;