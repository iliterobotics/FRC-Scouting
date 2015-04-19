var mongoose = require('mongoose');

var RecycleRushTeamDataSchema = new mongoose.Schema({
	_id: Number,
  team: { 
    type: Number, ref: 'Team' 
  },
  match: { 
    type: Number, ref: 'Match' 
  },
	completed: {type: Boolean, default: false},
	author: String,
	autonomous: {
    toteSet: {type: Boolean, default: false},
    numCans: {type: Number, default: 0},
		numTotes: {type: Number, default: 0},
		isInAutoZone:	{type: Boolean, default: false}
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
    efficiency: {type: Number, default: 0},
    autonomous: {type: Boolean, default: false},
    cansAttempted: {type: Number, default: 0},
    cansCaptured: {type: Number, default: 0},
    battle: {type: String, default: 'No Battle'}
  },
  ramp: {
    quantity: {type: Number, default: 0},
    toteCapacity: {type: Number, default: 0},
    numCycles: {type: Number, default: 0},
    interferes: {type: Boolean, default: false}
  },
  coop: {
    numberTotes: {type: Number, default: 0},
    type: {type: String, default: 'Upper'},
    efficiency: {type: Number, default: 0}
  }
});

var toteValue = 2;
var rcValue = 4;
var litterValue = 6;
var botInZoneValue = 4/3;
var stackedToteSetValue = 20;
var toteInZoneValue = 2;
var canInZoneValue = 8/3;
var coopStackValue = 40;

//teamSummary [], key mapping by team #
var getSummary = function(teamDataEntries) {
	var teamSummaries = {};
	var dataEntry;
	var summaryData;
	//create summary-level data for the team
	for(var index = 0; index < teamDataEntries.length; index++) {
		dataEntry = teamDataEntries[index];
		var teamStr = dataEntry.team.toString();
		if(teamSummaries[teamStr + '']) {
			summaryData = teamSummaries[teamStr + ''];
		} else {
		
			summaryData = {
				team: dataEntry.team,
				total: 0,
				completedMatches: 0,
				autonomous: {
					toteSet: 0,
					numCans: 0,
					numTotes: 0,
					isInAutoZone:	0,
					totalPoints: 0
				},
				stacking: {
					height: 0,
					maxHeight: 0,
					numHP: 0,
					numLF: 0,
					totalPoints: 0
				},
				capping: {
					height: 0,
					maxHeight: 0,
					litter: 0,
					numCaps: 0,
					totalCapPoints: 0,
					totalLitterPoints: 0
				},
				burglar: {
					efficiency: 0,
					autonomous: 0,
					cansAttempted: 0,
					cansCaptured: 0,
					battle: 0
				},
				ramp: {
					quantity: 0,
					toteCapacity: 0,
					numCycles: 0,
					interferes: 0
				},
				coop: {
					numberTotes: 0,
					efficiency: 0,
					totalPoints: 0
				},
				matches: []
			};
			
			teamSummaries[teamStr + ''] = summaryData;
		}

		//autonomous
		summaryData.autonomous.toteSet += dataEntry.autonomous.toteSet;
		summaryData.autonomous.numCans += dataEntry.autonomous.numCans;
		summaryData.autonomous.numTotes += dataEntry.autonomous.numTotes;
		summaryData.autonomous.isInAutoZone += dataEntry.autonomous.isInAutoZone;

		var autoScore = dataEntry.autonomous.toteSet * stackedToteSetValue +
				dataEntry.autonomous.numCans * canInZoneValue + 
				dataEntry.autonomous.numTotes * toteInZoneValue +
				dataEntry.autonomous.isInAutoZone * botInZoneValue;

		summaryData.autonomous.totalPoints += autoScore;

		//stacking - loop through all contained stacks
		var toteScore = 0;
		
		for(var stackIndex = 0; stackIndex < dataEntry.stacks.length; stackIndex++) {
//			console.log(dataEntry.stacks[stackIndex].height, summaryData.stacking.height);
			summaryData.stacking.height += dataEntry.stacks[stackIndex].height;
			summaryData.stacking.maxHeight = (dataEntry.stacks[stackIndex].height > summaryData.stacking.maxHeight) ? dataEntry.stacks[stackIndex].height : summaryData.stacking.maxHeight;

			summaryData.stacking.numHP += (dataEntry.stacks[stackIndex].location === 'HP') ? 1 : 0;
			summaryData.stacking.numLF += (dataEntry.stacks[stackIndex].location === 'LF') ? 1 : 0;

			toteScore += dataEntry.stacks[stackIndex].height * toteValue;
		}
//		summaryData.stacking.height = summaryData.stacking.height / dataEntry.stacks.length;

		summaryData.stacking.totalPoints += toteScore;

		//capping - loop through all contained caps
		summaryData.capping.numCaps += dataEntry.caps.length;
		var capScore = 0;
		var litterScore = 0;

		for(var capIndex = 0; capIndex < dataEntry.caps.length; capIndex++) {
			summaryData.capping.height += dataEntry.caps[capIndex].height;
			summaryData.capping.maxHeight = (dataEntry.caps[capIndex].height > summaryData.capping.maxHeight) ? dataEntry.caps[capIndex].height : summaryData.capping.maxHeight;

			summaryData.capping.litter += dataEntry.caps[capIndex].litter;

			capScore += dataEntry.caps[capIndex].height * rcValue;
			litterScore += dataEntry.caps[capIndex].litter * litterValue;
		}
		
//		summaryData.capping.height = summaryData.capping.height / dataEntry.caps.length;

		summaryData.capping.totalCapPoints += capScore;
		summaryData.capping.totalLitterPoints += litterScore;

		//burglar
		summaryData.burglar.efficiency += dataEntry.burglar.efficiency;
		summaryData.burglar.autonomous += dataEntry.burglar.autonomou;
		summaryData.burglar.cansAttempted += dataEntry.burglar.cansAttempted;
		summaryData.burglar.cansCaptured += dataEntry.burglar.cansCaptured;
		summaryData.burglar.battle += (dataEntry.burglar.battle === 'Win');

		//ramps
		summaryData.ramp.quantity += dataEntry.ramp.quantity;
		summaryData.ramp.toteCapacity += dataEntry.ramp.toteCapacity;
		summaryData.ramp.numCycles += dataEntry.ramp.numCycles;
		summaryData.ramp.interferes += dataEntry.ramp.interferes;

		//coop
		var isCoop = (dataEntry.coop.numberTotes > 0);
		summaryData.coop.numberTotes += dataEntry.coop.numberTotes;
		summaryData.coop.efficiency += isCoop;
		summaryData.coop.interferes += dataEntry.coop.interferes;

		var coopScore = isCoop * coopStackValue;
		summaryData.coop.totalPoints += coopScore;

		//matches[] formatting:
		summaryData.completedMatches += dataEntry.completed;
		
		var match = {
			id: dataEntry.match,
			score: autoScore + toteScore + capScore + litterScore + coopScore,
			autonomousScore: autoScore,
			totesScore: toteScore,
			capsScore: capScore,
			litterScore: litterScore,
			coopScore: coopScore
		}

		summaryData.matches.push(match);
		
		summaryData.total += autoScore + toteScore + capScore + litterScore + coopScore;
		
	}
	
	return teamSummaries;
};

//custom lookup by team
RecycleRushTeamDataSchema.statics.findByTeam = function(teamId, cb) {
	return this.find({ team: teamId }, cb);
};

//custom lookup for match
RecycleRushTeamDataSchema.statics.findTeamMatchData = function(teamId, matchId, cb) {
	return this.findOne({ team: teamId, match: matchId }, cb);
};

//custom lookup for scoring/summary for all teams
RecycleRushTeamDataSchema.statics.findSummary = function(cb) {
	//retrieve all team data...return immediately to keep async
	return this.find(function(err, teamDataEntries) {
		
		if(err) {
			cb(err,null);
		} else {
		
//			cb(err, teamDataEntries);
			cb(err,getSummary(teamDataEntries));
		}
		
	});
};

//custom lookup for scoring/summary
RecycleRushTeamDataSchema.statics.findTeamSummary = function(teamId, cb) {
	//retrieve all team data...return immediately to keep async
	return this.findByTeam(teamId, function(err, teamDataEntries) {
		
		if(err) {
			cb(err,null);
		} else {
		
			cb(err,getSummary(teamDataEntries));
		}
		
	});
};


//var RecycleRushScoringSchema = new mongoose.Schema({
//  toteValue: Number,
//  canValue: Number,
//  litterValue: Number
//});

mongoose.model('RecycleRushTeamData', RecycleRushTeamDataSchema);
//mongoose.model('RecycleRushScoring', RecycleRushScoringSchema);