// grab the RecycleRushTeamData model
var mongoose = require("mongoose");
var Chairmans = mongoose.model('Chairmans');

module.exports = function(app, auth) {
    
  //listing level routes - supports get
  app.route('/v1/chairmans').all(auth).get(function(req, res) {
		
		console.log('loading all chairmans summaries');
		
		// use mongoose to get all team match data in the database
		Chairmans.findSummary(2015,function(err, teamDataEntries) {

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
  app.route('/v1/chairmans/:teamId').all(auth).get(function (req, res){

    Chairmans.findByTeam(req.params.teamId,2015,function (err, teamData) {
      if(err) {
        res.send(err);
      } else {
        res.send(teamData);
      }
    });
  })
	.put(function (req, res){

		Chairmans.findByIdAndUpdate(req.body._id, req.body, {upsert: true}, function (err, teamData) {
			if (err) {
				res.send(err);
			} else {
				res.send(teamData);
			}
		});
  })
	.post(function (req, res){
		var teamData = new Chairmans(req.body);
		
    Chairmans.findByIdAndUpdate(teamData._id, teamData, {upsert: true}, function (err, teamData) {
			if (err) {
				res.send(err);
			} else {
				res.send(teamData);
			}
		});
  });
  
};