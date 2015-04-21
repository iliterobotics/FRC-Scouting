var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var mongoose = require("mongoose");
var app = express();

//models
var UserModel = require('./models/User');
var TeamModel = require("./models/Team");
var RecycleRushModel = require("./models/RecycleRush");
var MatchModel = require("./models/Match");
var ChairmansModel = require("./models/Chairmans");

//mongoose model objects
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Match = mongoose.model('Match');
var TeamData = mongoose.model('RecycleRushTeamData');
var Chairmans = mongoose.model('Chairmans');

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
	dataLoader.matchImport('config/Matches.xlsx','xlsx');
});

var TeamDataRoutes = require("./routes/RecycleRushRoutes");
var teamDataRouter = new TeamDataRoutes(app, auth);

TeamData.remove({}, function(err) { 
  console.log('RecycleRush Data removed');
	dataLoader.simboticsDataImport('config/Team_1114_2015_Championship_Scouting_Database-2.xlsx', 'Carson');
});

var ChairmansRoutes = require("./routes/ChairmansRoutes");
var chairmansRouter = new ChairmansRoutes(app, auth);

Chairmans.remove({}, function(err) {
	console.log('Chairmans data removed');
	dataLoader.chairmansImport('config/Chairmans.xlsx',2015);
});