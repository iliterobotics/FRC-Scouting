//Angular Factory for recycle rush team data api

///v1/teams/:teamId/data format:
//{
//  team: { 
//    type: Number, ref: 'Team' 
//  },
//  scoring: { 
//    average: Number,
//		autonomous: Number,
//		totes: Number,
//		caps: Number,
//		litter: Number,
//		coop: Number,
//  },
//	autonomous: {
//    toteSet: Number,
//    numCans: Number,
//		numTotes: Number,
//		isInAutoZone:	Boolean
//  },
//  stacks: [{
//    height: Number,
//    location: String 
//  }],
//  caps: [{
//    height: Number,
//    litter: Number
//  }],
//  burglar: {
//    efficiency: Number,
//    autonomous: Number,
//    cansAttempted: Number,
//    cansCaptured: Number,
//    battle: Number
//  },
//  ramp: {
//    quantity: Number,
//    toteCapacity: Number,
//    numCycles: Number,
//    interferes: Number
//  },
//	matches: [{
//		type: Schema.Types.ObjectId, ref: 'RecycleRushTeamData'
//	}]
//}

///v1/teams/:teamId/data/:matchId format:
//{
//  team: { 
//    type: Number, ref: 'Team' 
//  },
//  match: { 
//    type: Number, ref: 'Match' 
//  },
//	autonomous: {
//    toteSet: Boolean,
//    numCans: Number,
//		numTotes: Number,
//		isInAutoZone:	Boolean
//  },
//  stacks: [{
//    height: Number,
//    location: String 
//  }],
//  caps: [{
//    height: Number,
//    litter: Boolean
//  }],
//  burglar: {
//    efficiency: Number,
//    autonomous: Boolean,
//    cansAttempted: Number,
//    cansCaptured: Number,
//    battle: String
//  },
//  ramp: {
//    quantity: Number,
//    toteCapacity: Number,
//    numCycles: Number,
//    interferes: Boolean
//  },
//  coop: {
//    numberTotes: Number,
//    type: String,
//    efficiency: Number
//  }
//}

angular.module('ilite.common').factory('GameService', ['TeamMatchData', function (TeamMatchData) {

    //team #
    //team name
    return {
        name: 'recyclerush',
        year: 2015,
        matchData: function (team, match) {
            return new TeamMatchData({
                team: team,
                match: match,
                game: 'recyclerush',
                autonomous: {
                    toteSet: false,
                    numCans: 0,
                    numTotes: 0,
                    isInAutoZone: false
                },
                stacks: [],
                caps: [],
                burglar: {
                    efficiency: 0,
                    autonomous: false,
                    cansAttempted: 0,
                    cansCaptured: 0,
                    battle: 'No Battle'
                },
                ramp: {
                    quantity: 0,
                    toteCapacity: 0,
                    numCycles: 0,
                    interferes: false
                },
                coop: {
                    numberTotes: 0,
                    type: 'Top',
                    efficiency: 0
                }
            });
        }
    }

}]);