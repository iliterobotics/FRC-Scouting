var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  number: Number,
  name: String,
  matches: [{ 
    type: mongoose.Schema.Types.ObjectId, ref: 'Match' 
  }]
});

mongoose.model('Team', TeamSchema);