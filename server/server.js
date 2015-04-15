var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var mongoose = require("mongoose");
var app = express();
var TeamModel = require("./models/Team");
var Team = mongoose.model('Team');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ilite');

//    app.use(express.logger());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view options", {layout: false});
app.use(express.static(__dirname + '/../public'));

app.get('/', function(req, res){
    res.sendFile('/public/index.html');
});

app.listen(8080);
console.log('Express server started');

var parse = require('csv-parse');

var TeamRoutes = require("./routes/TeamRoutes");
var teamRouter = new TeamRoutes(app);

fs.readFile('config/teamlist', function (err, data) {
  if (err) throw err;
  
  parse(data, {delimiter: '\t'}, function(err, output){
    
    for(var index = 0; index < output.length; index++) {
      var teamToAdd = new Team({ number: output[index][0], name: output[index][1] });
//      console.log(teamToAdd);
      teamRouter.saveTeam(teamToAdd, function(err,result) {
        if(err) {
          console.log(err);
        } else {
          console.log('Added Team', result.number);
        }
      });
    }
  });
  
});