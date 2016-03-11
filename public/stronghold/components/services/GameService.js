//Angular Factory for recycle rush team data api

///v1/teams/:teamId/data format:
//{
//    team: dataEntry.team,
//    total: 0,
//    completedMatches: 0,
//    autonomous: {
//        numBouldersHigh: 0,
//        numBouldersLow: 0,
//        numDefenses: 0,
//        numReachedDefense: 0,
//        totalPoints: 0
//    },
//    boulders: {
//        numMadeHg: 0,
//        numMadeLg: 0,
//        totalHg: 0,
//        totalLg: 0,
//        totalPoints: 0
//    },
//    defenses: {
//        damaged: {},
//        totalAttempted: 0,
//        totalPoints: 0
//    },
//    challenge: {
//        numCaptured: 0,
//        numBreached: 0,
//        numChallenged: 0,
//        numScaled: 0
//    },
//    matches: []
//};

///v1/teams/:teamId/data/:matchId format:
//team: {
//    type: Number,
//    ref: 'Team'
//},
//match: {
//    type: Number,
//    ref: 'Match'
//},
//completed: {
//    type: Boolean,
//    default: false
//},
//author: String,
//autonomous: {
//    numBouldersHigh: {
//        type: Number,
//        default: 0
//    },
//    numBouldersLow: {
//        type: Number,
//        default: 0
//    },
//    numDefenses: {
//        type: Number,
//        default: 0
//    },
//    isReachDefense: {
//        type: Boolean,
//        default: false
//    }
//},
//boulders: [{
//    type: String,
//    location: String,
//    distance: String,
//    madeShot: {
//        type: Boolean,
//        default: false
//    }
//}],
//defenses: [{
//    type: String,
//    isSuccess: {
//        type: Boolean,
//        default: false
//    }
//}],
//challenge: {
//    isBreached: {
//        type: Boolean,
//        default: false
//    },
//    isCaptured: {
//        type: Boolean,
//        default: false
//    },
//    isScaled: {
//        type: Boolean,
//        default: false
//    },
//    isChallenged: {
//        type: Boolean,
//        default: false
//    }
//}

angular.module('ilite.common').factory('GameService', ['TeamMatchData', function (TeamMatchData) {

    //team #
    //team name
    return {
        name: 'stronghold',
        year: 2015,
        matchData: function (team, match) {
            return new TeamMatchData({
                team: team,
                match: match,
                game: 'stronghold',
                autonomous: {
                    numBouldersHigh: 0,
                    numBouldersLow: 0,
                    numDefenses: 0,
                    isReachDefense: false
                },
                boulders: [],
                defenses: []
            });
        }
    }

}]);