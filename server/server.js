var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var mongoose = require("mongoose");
var app = express();

//models
var UserModel = require('./models/User');
var TeamModel = require("./models/Team");
var MatchModel = require("./models/Match");
var RecycleRushModel = require("./models/RecycleRush");

//mongoose model objects
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Match = mongoose.model('Match');
var TeamData = mongoose.model('RecycleRushTeamData');

//auth
var passport = require('passport');
var jwt = require('express-jwt');
require('./config/passport');

//data loader
var dataLoader = require('./controllers/dataLoader.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ilite');
mongoose.connection.db.dropDatabase();

//    app.use(express.logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view options", {layout: false});
app.use(express.static(__dirname + '/../public'));
app.use(passport.initialize());

app.get('/', function(req, res){
    res.sendFile('/public/index.html');
});

app.listen(8080);
console.log('Express server started');

var parse = require('csv-parse');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var UserRoutes = require("./routes/UserRoutes");
var UserRouter = new UserRoutes(app, auth);

dataLoader.userImport('config/Users.xlsx');

//User.remove({}, function(err) { 
//  console.log('Users removed');
//	
//	dataLoader.userImport('config/Users.xlsx');
//	
//});

var TeamRoutes = require("./routes/TeamRoutes");
var teamRouter = new TeamRoutes(app, auth);

Team.remove({}, function(err) { 
  console.log('Teams removed');
});

var MatchRoutes = require("./routes/MatchRoutes");
var matchRouter = new MatchRoutes(app, auth);
Match.remove({}, function(err) { 
  console.log('Matches removed');
});

var TeamDataRoutes = require("./routes/RecycleRushRoutes", auth);
var teamDataRouter = new TeamDataRoutes(app, auth);

TeamData.remove({}, function(err) { 
  console.log('RecycleRush Data removed');
	dataLoader.simboticsDataImport('config/Team_1114_2015_Championship_Scouting_Database-2.xlsx', 'Carson');
});


//some sample matches to populate...
//fs.readFile('config/matchList', function (err, data) {
//  if (err) throw err;
//  
//  parse(data, {delimiter: '\t'}, function(err, output){
//    
//    for(var index = 0; index < output.length; index++) {
//      
//      var matchToAdd = new Match({ _id: output[index][0],
//                                  alliances: [{
//                                    name: 'Red',
//                                    teams: [
//                                      output[index][1],
//                                      output[index][2],
//                                      output[index][3],
//                                    ],
//                                    score: output[index][4],
//                                  },
//                                  {
//                                    name: 'Blue',
//                                    teams: [
//                                      output[index][5],
//                                      output[index][6],
//                                      output[index][7],
//                                    ],
//                                    score: output[index][8],
//                                  }]
//                                 });
////      console.log(matchToAdd);
//      matchRouter.saveMatch(matchToAdd, function(err,result) {
//        if(err) {
//          console.log(err);
//        } else {
//          console.log('Added Match', result._id);
//        }
//      });
//    }
//  });
//});

//read preloaded teams...
//fs.readFile('config/teamlist', function (err, data) {
//	if (err) throw err;
//
//	parse(data, {delimiter: '\t'}, function(err, output){
//
//		for(var index = 0; index < output.length; index++) {
//			var teamToAdd = new Team({ _id: output[index][0], name: output[index][1] });
////      console.log(teamToAdd);
//			teamRouter.saveTeam(teamToAdd, function(err,result) {
//				if(err) {
//					console.log(err);
//				} else {
////          console.log('Added Team', result._id);
//				}
//			});
//		}
//	});
//
//});