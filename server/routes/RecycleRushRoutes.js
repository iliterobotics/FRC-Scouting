// grab the RecycleRushTeamData model
var mongoose = require("mongoose");
var RecycleRushTeamData = mongoose.model('RecycleRushTeamData');

module.exports = function(app, auth) {
  
  var matchRoutes = this;
  
  //listing level routes - supports get
  app.route('/v1/recyclerush/matchData').all(auth).get(function(req, res) {
		// use mongoose to get all team match data in the database
		RecycleRushTeamData.findSummary(function(err, teamDataEntries) {

			// if there is an error retrieving, send the error. 
			// nothing after res.send(err) will execute
			if (err) {
				res.send(err);
			}

			//need to bubble this up to summary level
			res.json(teamDataEntries); // return all teamDataEntries in JSON format
		});
  });
  
  //team-level supports get
  app.route('/v1/recyclerush/matchData/:teamId').all(auth).get(function (req, res){

    RecycleRushTeamData.findTeamSummary(req.params.teamId, function (err, teamData) {
      if(err) {
        res.send(err);
      } else {
        res.send(teamData);
      }
    });
  });
	
	//team and match level supports get and put/update
	app.route('/v1/recyclerush/matchData/:teamId/:matchId').all(auth).get(function (req, res){

    RecycleRushTeamData.findTeamMatchData(req.params.teamId,req.params.matchId, function (err, teamData) {
      if(err) {
        res.send(err);
      } else {
        res.send(teamData);
      }
    });
  })
  .put(function (req, res){
		console.log('received put request for RR matchData', req.body._id, req.body.team, req.body.match);
    RecycleRushTeamData.findByIdAndUpdate(req.body._id, req.body, function (err, teamData) {
			if (err) {
				res.send(err);
			} else {
				res.send(teamData);
			}
		});
  })
	.post(function (req, res){
		var teamData = new RecycleRushTeamData(req.body);
		teamData.auther = req.payload.username;
    teamData.save(function(err){
			if (err) {
				res.send(err);
			} else {
				res.send(teamData);
			}
		});
  });
};