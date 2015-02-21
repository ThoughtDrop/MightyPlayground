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
  // public: boolean, //for private or public messages (non MVP)
  message: String,
  votes: { type: Number, default: 0 }
});

messagesSchema.index({ location : '2dsphere' });

var Message = mongoose.model('Message', messagesSchema);


// Sample message data

// Message.create({
//       _id: Math.floor(Math.random()*100000),
//       location: {coordinates: [-122.408995, 37.783624] },
//       message: 'hr2',
//       votes: 99
//     });

// Message.create({
//       _id: Math.floor(Math.random()*100000),
//       location: {coordinates: [-122.408996, 37.783624] },
//       message: 'hr3'
//       votes: 39
//     });

// Message.create({
//       _id: Math.floor(Math.random()*100000),
//       location: {coordinates: [0, 0] },
//       message: 'Africa'
//       votes: 39
//     });

// message.pre('save', function(next) {
//   this.created_at = new Date();
//   next();
// });

module.exports = Message;