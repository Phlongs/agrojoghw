var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublisherSchema = new Schema({
  publisher: {
    type: String
  }
});

var Publisher = mongoose.model('Publisher', PublisherSchema);
module.exports = Publisher;