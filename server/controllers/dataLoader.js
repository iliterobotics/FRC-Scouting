var mongoose = require("mongoose");
var XLSX = require('xlsx');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Match = mongoose.model('Match');
var RecycleRushTeamData = mongoose.model('RecycleRushTeamData');

module.exports = {
	
	//import simbotics data for a division
	simboticsDataImport: function(file, division) {
		
		var scoutingWorkbook = XLSX.readFile(file);
		
		var divisionSheet = scoutingWorkbook.Sheets[division];
		
		var normalizedNumStacks = 3;
		
		//loop until the team is blank
		var rowId = 2;
		var teamCol = 'A';
		var autoScoreCol = 'O';
		var stackScoreCol = 'V';
		var coopScoreCol = 'AC';
		var litterScoreCol = 'AJ';
		
		var teamAddress = teamCol + rowId;
		var teamRow = divisionSheet[teamAddress];
		
		while(teamRow) {
//			console.log('loading data for team', teamRow.v,divisionSheet[stackScoreCol + rowId].v);
			
			var stacksList = [];
			var capsList = [];
			
			var toteContainerScore = divisionSheet[stackScoreCol + rowId].v;
			var avgStackScore = toteContainerScore / normalizedNumStacks;
			var avgStackHeight = avgStackScore / 3 / 2;
			var avgCaps = avgStackScore / 2 / 4;
			
			var litterScore = divisionSheet[litterScoreCol + rowId].v;
			var avgLitterScore = litterScore/normalizedNumStacks;
			
			for(var stackIndex = 0; stackIndex < normalizedNumStacks; stackIndex++) {
				stacksList.push({ height: avgStackHeight.toFixed(2), location: 'HP'});
				capsList.push({ height: avgStackHeight.toFixed(2), litter: avgLitterScore/6 });
			}
			
			var teamData = new RecycleRushTeamData({
				_id: (teamRow.v * 10000 + -divisionSheet['E' + rowId].v),
				team: teamRow.v,
				match: -divisionSheet['E' + rowId].v,
				completed: true,
				autonomous: {
					toteSet: false,
					numCans: 0,
					numTotes: 0,
					isInAutoZone:	false
				},
				stacks: stacksList,
				caps: capsList
			});
			
			//add the team
			var teamToAdd = new Team({ _id: teamRow.v, name: divisionSheet['B' + rowId].v });
//      console.log(teamToAdd);
			
			teamToAdd.save(function(err){
				if (err) {
//					console.log(err);
				}
			});
			
			//load the team data
			teamData.save(function(err){
				if (err) {
					console.log(err);
				}
			});
			
			
			
			rowId++;
			teamAddress = teamCol + rowId;
			teamRow = divisionSheet[teamAddress];
			
//			console.log(teamData);
		}
	},
	
	userImport: function(file) {
		var userWorkbook = XLSX.readFile(file);
		
		var userSheet = userWorkbook.Sheets['users'];
		
		var rowId = 2;
		var colId = 'C';
		
		var userRow = userSheet[colId + rowId];
		
		while(userRow) {
			var userToAdd = new User ({ username: userRow.v });
			userToAdd.setPassword('team1885');
			
			userToAdd.save(function (err){
				if(err){ console.log(err); }
			});
			
			rowId++;
			userRow = userSheet[colId + rowId];
		}
		
	},
	
	matchImport: function(file, type) {
		if(type === 'xlsx') {
			var matchWorkbook = XLSX.readFile(file);

			var matchSheet = matchWorkbook.Sheets['matches'];

			var rowId = 2;
			var matchTime = 'A';
			var matchId = 'B';

			var matchRow = matchSheet[matchId + rowId];

			while(matchRow) {
				
				var matchToAdd = new Match(
					{ 
						_id: matchRow.v,
						dateTime: matchSheet[matchTime + rowId].v,
						alliances: [{
							name: 'Red',
							teams: [
								matchSheet['C' + rowId].v,
								matchSheet['D' + rowId].v,
								matchSheet['E' + rowId].v,
							],
							score: 0,
						},
						{
							name: 'Blue',
							teams: [
								matchSheet['F' + rowId].v,
								matchSheet['G' + rowId].v,
								matchSheet['H' + rowId].v,
							],
							score: 0,
						}]
					 });

				Match.saveMatch(matchToAdd, function (err){
					if(err){ console.log(err); }
				});

				rowId++;
				matchRow = matchSheet[matchId + rowId];
			}
		} else if(type === 'csv') {
			
		}
	}
	
};