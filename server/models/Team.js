var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  matches: [{ 
    type: Number, ref: 'Match' 
  }]
});

//find matches for each team
TeamSchema.statics.findByMatch = function (matchId, cb) {
  return this.find({matches: matchId}, cb);
};

mongoose.model('Team', TeamSchema);