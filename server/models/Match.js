var mongoose = require('mongoose');

var MatchSchema = new mongoose.Schema({
  number: Number,
  alliances: [{ 
    name: String,
    score: Number,
    teams: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: 'Team' 
    }]
  }]
});

mongoose.model('Match', MatchSchema);