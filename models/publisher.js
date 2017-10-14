var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublisherSchema = new Schema({
  publisher: {
    type: String
  },
  game: [{ type: Schema.Types.ObjectId, ref: 'GameInfo' }]
});

var Publisher = mongoose.model('Publisher', PublisherSchema);
module.exports = Publisher;