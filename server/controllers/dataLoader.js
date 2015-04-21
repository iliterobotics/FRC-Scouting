var mongoose = require("mongoose");
var XLSX = require('xlsx');
var parse = require('csv-parse');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Match = mongoose.model('Match');
var RecycleRushTeamData = mongoose.model('RecycleRushTeamData');
var Chairmans = mongoose.model('Chairmans');

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
	},
	
	chairmansImport: function(file, latestYear) {
		var caWorkbook = XLSX.readFile(file);

		var caSheet = caWorkbook.Sheets['chairmans'];

		var rowId = 2;
		var teamId = 'B';

		var caTeamRow = caSheet[teamId + rowId];

		while(caTeamRow) {
			console.log(caTeamRow.v);
			var caToAdd = new Chairmans({
				_id: caTeamRow.v,
				name: caSheet['C' + rowId].v,
				division: caSheet['A' + rowId].v,
				founded: (caSheet['D' + rowId] ? caSheet['D' + rowId].v : 'N/A'),
				location: (caSheet['E' + rowId] ? caSheet['E' + rowId].v : 'N/A'),
				recentAwardLocation: (caSheet['F' + rowId] ? caSheet['F' + rowId].v : 'N/A'),
				winHistoryLink: (caSheet['M' + rowId] ? caSheet['M' + rowId].v : 'N/A'),
				championshipsAttended: caSheet['I' + rowId].v,
				championshipsSelected: caSheet['J' + rowId].v,
				robotPerformance: (caSheet['P' + rowId] ? caSheet['P' + rowId].v : 'N/A'),
				comments: (caSheet['O' + rowId] ? caSheet['O' + rowId].v : 'N/A'),
				ppw: (caSheet['K' + rowId] ? caSheet['K' + rowId].v : 0)
			});
			
			var caRegionalRow = caSheet['G' + rowId];

			if(caRegionalRow && caRegionalRow.v) {
				console.log('Regional',caRegionalRow.v);
				var output = String(caRegionalRow.v).split(', ');
				caToAdd.CAs = [];

				for(var index = 0; index < output.length; index++) {

					caToAdd.CAs.push({
						year: Number(output[index]) + 2000,
						caType: 'Regional/DCMP'
					});

					if(caToAdd.CAs[caToAdd.CAs.length-1].year === latestYear) {
						caToAdd.CAs[caToAdd.CAs.length-1].location = (caSheet['F' + rowId] ? caSheet['F' + rowId].v : 'N/A');
						caToAdd.CAs[caToAdd.CAs.length-1].essayLink = 'need the links';
						caToAdd.CAs[caToAdd.CAs.length-1].videoLink = (caSheet['N' + rowId] ? caSheet['N' + rowId].v : 'N/A');
					}

				}
			}
			
			var caDistrictRow = caSheet['H' + rowId];
			if(caDistrictRow && caDistrictRow.v) {
				console.log('District',caDistrictRow.v);
				output = String(caDistrictRow.v).split(', ');

				for(var index = 0; index < output.length; index++) {

					caToAdd.CAs.push({
						year: Number(output[index]) + 2000,
						caType: 'District'
					});

					if(caToAdd.CAs[caToAdd.CAs.length-1].year === latestYear) {
						caToAdd.CAs[caToAdd.CAs.length-1].location = (caSheet['F' + rowId] ? caSheet['F' + rowId].v : 'N/A');
						caToAdd.CAs[caToAdd.CAs.length-1].essayLink = 'need the links';
						caToAdd.CAs[caToAdd.CAs.length-1].videoLink = (caSheet['N' + rowId] ? caSheet['N' + rowId].v : 'N/A');
					}

				}
			}
		
			var eiRow = caSheet['L' + rowId];
			if(eiRow && eiRow.v) {
//				console.log(eiRow.v);
				
				output = String(eiRow.v).split(', ');

				caToAdd.EIAs = [];

				for(var index = 0; index < output.length; index++) {

					caToAdd.EIAs.push({
						year: Number(output[index]) + 2000
					});

				}
			}
			console.log('loaded team',caToAdd._id);
			caToAdd.save(function(err){
				if (err) {
					console.log(err);
				}
			});

			rowId++;
			caTeamRow = caSheet[teamId + rowId];
		}
	}
	
};