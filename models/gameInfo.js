var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameInfoSchema = new Schema({
  gameTitle: {
    type: String
  },
  gamePublisher: {
    type: String
  },
  gameImage: {
    type: String
  }
});

var GameInfo = mongoose.model('GameInfo', GameInfoSchema);
module.exports = GameInfo;