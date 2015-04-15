// grab the nerd model we just created
var mongoose = require("mongoose");
var Team = mongoose.model('Team');

module.exports = function(app) {

  this.saveTeam = function(team, cb) {
    Team.find({number : team.number}, function (err, docs) {
        if (docs.length){
            cb('Team ' + team.number + ' already exists',null);
        }else{
            team.save(function(err){
                cb(err,team);
            });
        }
    });
  };
  
  var teamRoutes = this;
  app.route('/v1/teams').post(function(req, res) {
    console.log("Attempting to add team",req.body);
    // use mongoose to get all teams in the database
    teamRoutes.saveTeam(new Team(req.body), function(err, team) {
      if(err) {
        res.send(err);
      } else {
        res.send(team);
      }
    });
  })
  .get(function(req, res) {
    // use mongoose to get all teams in the database
    Team.find(function(err, teams) {

      // if there is an error retrieving, send the error. 
      // nothing after res.send(err) will execute
      if (err) {
        res.send(err);
      }

      res.json(teams); // return all teams in JSON format
    });
  });
  
  app.route('/v1/teams/:id').delete(function (req, res){

    Team.findById(req.params.id, function (err, team) {
      if(!team) {
        res.send(err);
      } else {
        console.log('removing team', team);
        team.remove(function (err) {
          if (!err) {
            console.log("removed team", team.number);
            return res.send('');
          } else {
            console.log(err);
          }
        });
      }
    });
  });
  
};