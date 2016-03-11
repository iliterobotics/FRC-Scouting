var mongoose = require('mongoose');

var StrongholdTeamDataSchema = new mongoose.Schema({
    _id: Number,
    team: {
        type: Number,
        ref: 'Team'
    },
    match: {
        type: Number,
        ref: 'Match'
    },
    completed: {
        type: Boolean,
        default: false
    },
    author: String,
    autonomous: {
        numBouldersHigh: {
            type: Number,
            default: 0
        },
        numBouldersLow: {
            type: Number,
            default: 0
        },
        numDefenses: {
            type: Number,
            default: 0
        },
        isReachDefense: {
            type: Boolean,
            default: false
        }
    },
    boulders: [{
        shotType: String,
        location: String,
        distance: String,
        madeShot: {
            type: Boolean,
            default: false
        }
  }],
    defenses: [{
        defenseType: String,
        isSuccess: {
            type: Boolean,
            default: false
        }
  }],
    challenge: {
        isBreached: {
            type: Boolean,
            default: false
        },
        isCaptured: {
            type: Boolean,
            default: false
        },
        isScaled: {
            type: Boolean,
            default: false
        },
        isChallenged: {
            type: Boolean,
            default: false
        }
    },
    notes: String
});

var hgValue = 5;
var lgValue = 2;
var breachValue = 20;
var captureValue = 25;
var scaleValue = 15;
var challengeValue = 5;
var damageDefenseValue = 5;

var autoHgValue = 10;
var autoLgValue = 5;
var autoDefense = 10;
var autoReachDefense = 2;

//teamSummary [], key mapping by team #
var getSummary = function (teamDataEntries) {
    var teamSummaries = {};
    var dataEntry;
    var summaryData;
    //create summary-level data for the team
    for (var index = 0; index < teamDataEntries.length; index++) {
        dataEntry = teamDataEntries[index];
        var teamStr = dataEntry.team.toString();
        if (teamSummaries[teamStr + '']) {
            summaryData = teamSummaries[teamStr + ''];
        } else {

            summaryData = {
                team: dataEntry.team,
                total: 0,
                completedMatches: 0,
                autonomous: {
                    numBouldersHigh: 0,
                    numBouldersLow: 0,
                    numDefenses: 0,
                    numReachedDefense: 0,
                    totalPoints: 0
                },
                boulders: {
                    numMadeHg: 0,
                    numMadeLg: 0,
                    totalHg: 0,
                    totalLg: 0,
                    totalPoints: 0
                },
                defenses: {
                    damaged: {},
                    totalAttempted: 0,
                    totalPoints: 0
                },
                challenge: {
                    numCaptured: 0,
                    numBreached: 0,
                    numChallenged: 0,
                    numScaled: 0,
                    totalTowerPoints: 0,
                    totalCastlePoints: 0
                },
                matches: []
            };

            teamSummaries[teamStr + ''] = summaryData;
        }

        //autonomous
        summaryData.autonomous.numBouldersHigh += dataEntry.autonomous.numBouldersHigh;
        summaryData.autonomous.numBouldersLow += dataEntry.autonomous.numBouldersLow;
        summaryData.autonomous.numDefenses += dataEntry.autonomous.numDefenses;
        summaryData.autonomous.numReachedDefense += dataEntry.autonomous.isReachDefense;

        var autoScore = dataEntry.autonomous.numBouldersHigh * autoHgValue +
            dataEntry.autonomous.numBouldersLow * autoLgValue +
            dataEntry.autonomous.numDefenses * autoDefense +
            dataEntry.autonomous.isReachDefense * autoReachDefense;

//        console.log(dataEntry.autonomous.numBouldersHigh, dataEntry.autonomous.numBouldersLow,dataEntry.autonomous.numDefenses,);
        summaryData.autonomous.totalPoints += autoScore;

        //boulders - loop through all contained boulders
        var boulderScore = 0;
        var numHgScores = 0;
        var numHgShots = 0;
        var numLgScores = 0;
        var numLgShots = 0;
        for (var boulderIndex = 0; boulderIndex < dataEntry.boulders.length; boulderIndex++) {

            summaryData.boulders.numMadeHg += (dataEntry.boulders[boulderIndex].shotType === 'High' && dataEntry.boulders[boulderIndex].madeShot) ? 1 : 0;
            summaryData.boulders.numMadeLg += (dataEntry.boulders[boulderIndex].shotType === 'Low' && dataEntry.boulders[boulderIndex].madeShot) ? 1 : 0;

            numHgShots += (dataEntry.boulders[boulderIndex].shotType === 'High') ? 1 : 0;
            numLgShots += (dataEntry.boulders[boulderIndex].shotType === 'Low') ? 1 : 0;

            numHgScores += (dataEntry.boulders[boulderIndex].shotType === 'High' && dataEntry.boulders[boulderIndex].madeShot) ? 1 : 0;
            numLgScores += (dataEntry.boulders[boulderIndex].shotType === 'Low' && dataEntry.boulders[boulderIndex].madeShot) ? 1 : 0;

        }

        boulderScore += numHgScores * hgValue + numLgScores * lgValue;

        summaryData.boulders.totalHg += numHgShots;
        summaryData.boulders.totalLg += numLgShots;
        summaryData.boulders.totalPoints += boulderScore;

        if (!summaryData.defenses.damaged['total']) {
            summaryData.defenses.damaged['total'] = 0;
        }

        //defenses - loop through all contained
        var damagedDefenses = 0;

        summaryData.defenses.totalAttempted += dataEntry.defenses.length;
        for (var defenseIndex = 0; defenseIndex < dataEntry.defenses.length; defenseIndex++) {

            if (!summaryData.defenses.damaged[dataEntry.defenses[defenseIndex].defenseType]) {
                summaryData.defenses.damaged[dataEntry.defenses[defenseIndex].defenseType] = 0;
            }

            summaryData.defenses.damaged[dataEntry.defenses[defenseIndex].defenseType] += (dataEntry.defenses[defenseIndex].isSuccess);

            damagedDefenses += (dataEntry.defenses[defenseIndex].isSuccess);

        }

        summaryData.defenses.damaged['total'] += damagedDefenses;

        summaryData.defenses.totalPoints += damagedDefenses * damageDefenseValue;

        summaryData.challenge.numCaptured += dataEntry.challenge.isCaptured;
        summaryData.challenge.numBreached += dataEntry.challenge.isBreached;
        summaryData.challenge.numScaled += dataEntry.challenge.isScaled;
        summaryData.challenge.numChallenged += dataEntry.challenge.isChallenged;

        var defenseScore = damagedDefenses * damageDefenseValue;
        var castleScore = dataEntry.challenge.isBreached * breachValue + dataEntry.challenge.isCaptured * captureValue;
        var towerScore = dataEntry.challenge.isChallenged * challengeValue + dataEntry.challenge.isScaled * scaleValue;

        summaryData.challenge.totalTowerPoints += towerScore;
        summaryData.challenge.totalCastlePoints += castleScore;

        //matches[] formatting:
        summaryData.completedMatches += dataEntry.completed;

        var match = {
            id: dataEntry.match,
            score: autoScore + boulderScore + defenseScore + castleScore + towerScore,
            autonomousScore: autoScore,
            boulderScore: boulderScore,
            defenseScore: defenseScore,
            castleScore: castleScore,
            towerScore: towerScore
        }

        summaryData.matches.push(match);

        summaryData.total += autoScore + boulderScore + defenseScore + castleScore + towerScore;

    }

    return teamSummaries;
};

//custom lookup by team
StrongholdTeamDataSchema.statics.findByTeam = function (teamId, cb) {
    return this.find({
        team: teamId
    }, cb);
};

//custom lookup for match
StrongholdTeamDataSchema.statics.findTeamMatchData = function (teamId, matchId, cb) {
    return this.findOne({
        team: teamId,
        match: matchId
    }, cb);
};

//custom lookup for scoring/summary for all teams
StrongholdTeamDataSchema.statics.findSummary = function (cb) {
    //retrieve all team data...return immediately to keep async
    return this.find(function (err, teamDataEntries) {

        if (err) {
            cb(err, null);
        } else {

            //			cb(err, teamDataEntries);
            cb(err, getSummary(teamDataEntries));
        }

    });
};

//custom lookup for scoring/summary
StrongholdTeamDataSchema.statics.findTeamSummary = function (teamId, cb) {
    //retrieve all team data...return immediately to keep async
    return this.findByTeam(teamId, function (err, teamDataEntries) {

        if (err) {
            cb(err, null);
        } else {

            cb(err, getSummary(teamDataEntries));
        }

    });
};

StrongholdTeamDataSchema.statics.gameId = function () {
    return 'stronghold';
}

//var StrongholdScoringSchema = new mongoose.Schema({
//  toteValue: Number,
//  canValue: Number,
//  litterValue: Number
//});

mongoose.model('StrongholdTeamData', StrongholdTeamDataSchema);
//mongoose.model('StrongholdScoring', StrongholdScoringSchema);