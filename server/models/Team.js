var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  _id: Number,
  name: String
});

mongoose.model('Team', TeamSchema);