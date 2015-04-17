var mongoose = require('mongoose');

var RecycleRushTeamDataSchema = new mongoose.Schema({
  team: { 
    type: Number, ref: 'Team' 
  },
  match: { 
    type: Number, ref: 'Match' 
  },
	autonomous: {
    toteSet: Boolean,
    numCans: Number,
		numTotes: Number,
		isInAutoZone:	Boolean
  },
  stacks: [{
    height: Number,
    location: String 
  }],
  caps: [{
    height: Number,
    litter: Boolean
  }],
  burglar: {
    efficiency: Number,
    autonomous: Boolean,
    cansAttempted: Number,
    cansCaptured: Number,
    battle: String
  },
  ramp: {
    quantity: Number,
    toteCapacity: Number,
    numCycles: Number,
    interferes: Boolean
  },
  coop: {
    numberTotes: Number,
    type: String,
    efficiency: Number
  }
});

//custom lookup by team
RecycleRushTeamDataSchema.statics.findByTeam = function(teamId, cb) {
	return this.find({ team: teamId }, cb);
};

//custom lookup for match
RecycleRushTeamDataSchema.statics.findTeamMatchData = function(teamId, matchId, cb) {
	return this.findOne({ team: teamId, match: matchId }, cb);
};

//var RecycleRushScoringSchema = new mongoose.Schema({
//  toteValue: Number,
//  canValue: Number,
//  litterValue: Number
//});

mongoose.model('RecycleRushTeamData', RecycleRushTeamDataSchema);
//mongoose.model('RecycleRushScoring', RecycleRushScoringSchema);