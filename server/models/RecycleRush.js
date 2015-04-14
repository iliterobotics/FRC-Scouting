var mongoose = require('mongoose');

var RecycleRushTeamDataSchema = new mongoose.Schema({
  team: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Team' 
  },
  match: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'Match' 
  },
  stacks: [{
    height: Number,
    type: String
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
  
var RecycleRushScoringSchema = new mongoose.Schema({
  toteValue: Number,
  canValue: Number,
  litterValue: Number
});

mongoose.model('RecycleRushTeamData', RecycleRushTeamDataSchema);
mongoose.model('RecycleRushScoring', RecycleRushScoringSchema);