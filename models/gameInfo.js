var mongoose = require('mongoose');
var Publisher = require('./publisher.js');
var Schema = mongoose.Schema;

var GameInfoSchema = new Schema({
  gameTitle: {
    type: String
  },
  gamePublisher: [{ type: Schema.Types.ObjectId, ref: 'Publisher' }],
  gameImage: {
    type: String
  }
});

var GameInfo = mongoose.model('GameInfo', GameInfoSchema);
module.exports = GameInfo;