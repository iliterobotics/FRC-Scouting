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

angular.module('ilite.common').factory('TeamMatchData', ['$resource', function($resource) {

  //team #
  //team name
  return $resource('/v1/recyclerush/matchData/:teamId/:matchId', { teamId: '@team', matchId: '@match'},
               {
                 update: { method: 'PUT' }
               });    

}]);