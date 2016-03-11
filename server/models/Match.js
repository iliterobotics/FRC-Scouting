var mongoose = require('mongoose');

var RecycleRushMatchData = mongoose.model('RecycleRushTeamData');
var StrongholdMatchData = mongoose.model('StrongholdTeamData');

var MatchSchema = new mongoose.Schema({
    _id: Number,
    dateTime: String,
    alliances: [{
        name: String,
        score: Number,
        teams: [{
            type: Number,
            ref: 'Team'
    }]
  }]
});

//find matches for each team
MatchSchema.statics.findByTeam = function (teamId, cb) {
    return this.find({
        "alliances.teams": teamId
    }, cb);
};

MatchSchema.statics.saveMatch = function (game, match, cb) {
    return this.find({
        _id: match._id
    }, function (err, docs) {
        if (docs.length) {
            cb('match ' + match._id + ' already exists', null);
        } else {

            //add a match data entry for every match
            for (var allianceIndex = 0; allianceIndex < match.alliances.length; allianceIndex++) {
                for (var teamIndex = 0; teamIndex < match.alliances[allianceIndex].teams.length; teamIndex++) {

                    var genericMatch = {
                        _id: (match.alliances[allianceIndex].teams[teamIndex] * 10000 + match._id),
                        team: match.alliances[allianceIndex].teams[teamIndex],
                        match: match._id
                    };

                    var matchData = (game === 'recyclerush' ? new RecycleRushMatchData(genericMatch) : new StrongholdMatchData(genericMatch));

                    matchData.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }

            match.save(function (err) {
                cb(err, match);
            });
        }
    });
}

mongoose.model('Match', MatchSchema);