var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var User = require('./user');

var messagesSchema = new mongoose.Schema({
  //TODO: make _id autoIncrement using autoIncrement
  _id: Number,
  // _creator: [{type: Number, ref: 'User'}],
  created_at: { type: Date },
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
  votes: { type: Number, default: 0 },
  messageDetail: []
});

messagesSchema.index({ location : '2dsphere' });

var Message = mongoose.model('Message', messagesSchema);
  

module.exports = Message;