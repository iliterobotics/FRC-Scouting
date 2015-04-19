// grab the Team model
var mongoose = require("mongoose");
var Team = mongoose.model('Team');
//var Match = mongoose.model('Match');

module.exports = function(app, auth) {
	
  this.saveTeam = function(teamToAdd, cb) {
    Team.findById(teamToAdd._id, function (err, team) {
        if (err){
          cb('Team ' + team._id + ' already exists',null);
        }else{
					
					if(err) {
						console.log(err);
					}
					
					teamToAdd.save(function(err){
						cb(err,teamToAdd);
					});
					
//					Match.findByTeam(teamToAdd._id, function(err, matches) {
//
//						if(err) {
//							console.log(err);
//						} else if(matches.length > 0) {
//							console.log(matches);
//						}
//
//						if(matches) {
//							for(var index = 0; index < matches.length; index++) {
//								teamToAdd.matches.push(matches[index]._id);
//							}
//						}
//						
//					});
        }
    });
  };
  
  var teamRoutes = this;
  
  //listing level routes
  app.route('/v1/teams').all(auth).post(function(req, res) {
    console.log("Attempting to add team",req.body);
    // use mongoose to save the team...
    teamRoutes.saveTeam(new Team(req.body), function(err, team) {
      if(err) {
        res.status(500).send(err);
      } else {
        res.send(team);
      }
    });
    
    //now we need to update the matches table with the proper references
  })
  .get(function(req, res) {
    // use mongoose to get all teams in the database
    Team.find(function(err, teams) {

      // if there is an error retrieving, send the error. 
      // nothing after res.send(err) will execute
      if (err) {
        res.status(500).send(err);
      } else {
				res.send(teams);
			}
    });
  });
  
  //individual team-level CRUD
  app.route('/v1/teams/:id').all(auth).get(function (req, res){

    Team.findById(req.params.id, function (err, team) {
      if(err) {
        res.status(500).send(err);
      } else {
        res.send(team);
      }
    });
  })
  .put(function (req, res){

    Team.findByIdAndUpdate(req.params.id, req.body, function (err, team) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(team);
    }
  });
  })
  .post(function(req, res) {
    console.log("Attempting to add team",req.body);
    
    //when we add a team we need to link existing matches
    var newTeam = new Team(req.body);
		
		// use mongoose to save the team...
		teamRoutes.saveTeam(newTeam, function(err, team) {
			if(err) {
				res.status(500).send(err);
			} else {
				res.send(team);
			}
		});
  })
  .delete(function (req, res){

    Team.findById(req.params.id, function (err, team) {
      if(err) {
        res.send(err);
      } else {
        console.log('removing team', team);
        team.remove(function (err) {
          if (!err) {
            console.log("removed team", team._id);
            res.send('');
          } else {
            console.log(err);
            res.status(500).send('Could not delete team ' + team._id);
          }
        });
      }
    });
  });
  
};