var mongoose = require('mongoose');

var MatchSchema = new mongoose.Schema({
  _id: Number,
  alliances: [{ 
    name: String,
    score: Number,
    teams: [{ 
      type: Number, ref: 'Team' 
    }]
  }]
});

//find matches for each team
MatchSchema.statics.findByTeam = function (teamId, cb) {
  return this.find({"alliances.teams": teamId}, cb);
};

mongoose.model('Match', MatchSchema);