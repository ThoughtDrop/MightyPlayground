var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');

var User = require('./user');

var messagesSchema = new mongoose.Schema({
  _id: Number,
  photo_url: String,
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

//messagesSchema.plugin(autoIncrement.plugin, 'id')
messagesSchema.index({ location : '2dsphere' });

var Message = mongoose.model('Message', messagesSchema);

module.exports = Message;