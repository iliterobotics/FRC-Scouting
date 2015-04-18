// grab the Match model
var mongoose = require("mongoose");
var Match = mongoose.model('Match');
var RecycleRushMatchData = mongoose.model('RecycleRushTeamData');

module.exports = function(app) {

  this.saveMatch = function(match, cb) {
    Match.find({_id : match._id}, function (err, docs) {
			if (docs.length){
				cb('match ' + match._id + ' already exists',null);
			}else{
				
				//add a match data entry for every match
				for(var allianceIndex = 0; allianceIndex < match.alliances.length; allianceIndex++) {
					for(var teamIndex = 0; teamIndex < match.alliances[allianceIndex].teams.length; teamIndex++) {
						var matchData = new RecycleRushMatchData({ team: match.alliances[allianceIndex].teams[teamIndex], match: match._id });
						
						matchData.save(function(err) {
							if(err) {
								console.log(err);
							}
						});
					}
				}
				
				match.save(function(err){
					cb(err,match);
				});
			}
    });
  };
  
  var matchRoutes = this;
  
  //listing level routes
  //optional var for team #
  app.route('/v1/match').post(function(req, res) {
    console.log("Attempting to add match",req.body);
    // use mongoose to get all matches in the database
    matchRoutes.saveMatch(new Match(req.body), function(err, match) {
      if(err) {
        res.send(err);
      } else {
        res.send(match);
      }
    });
  })
  .get(function(req, res) {
		
		var teamQuery = req.query.teamNumber;
		if(teamQuery) {
			//find all matches for a particular team
			Match.findByTeam(teamQuery, function(err, matches) {
				
				// if there is an error retrieving, send the error. 
				// nothing after res.send(err) will execute
				if (err) {
					res.send(err);
				}

				res.json(matches); // return all matches in JSON format
				
			});
		} else {
			// use mongoose to get all matches in the database
			Match.find(function(err, matches) {

				// if there is an error retrieving, send the error. 
				// nothing after res.send(err) will execute
				if (err) {
					res.send(err);
				}

				res.json(matches); // return all matches in JSON format
			});
		}
  });
  
  //individual match-level CRUD
  app.route('/v1/match/:id').get(function (req, res){

    Match.findById(req.params.id, function (err, match) {
      if(err) {
        res.send(err);
      } else {
        res.send(match);
      }
    });
  })
  .put(function (req, res){

    Match.findByIdAndUpdate(req.params.id, req.body, function (err, match) {
			if (err) {
				res.send(err);
			} else {
				res.send(match);
			}
		});
  })
	.post(function(req, res) {
    console.log("Attempting to add match",req.body);
    // use mongoose to get all matches in the database
    matchRoutes.saveMatch(new Match(req.body), function(err, match) {
      if(err) {
        res.send(err);
      } else {
        res.send(match);
      }
    });
  })
  .delete(function (req, res){

    Match.findById(req.params.id, function (err, match) {
      if(err) {
        res.send(err);
      } else {
        console.log('removing match', match);
        match.remove(function (err) {
          if (!err) {
            console.log("removed match", match._id);
            res.send('');
          } else {
            console.log(err);
            res.send(err);
          }
        });
      }
    });
  });
  
};