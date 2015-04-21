var mongoose = require('mongoose');
var util = require('util');

var ChairmansSchema = new mongoose.Schema({
  _id: Number,
	name: String,
	division: String,
	founded: Number,
	location: String,
	recentAwardLocation: String,
	winHistoryLink: String,
	championshipsAttended: Number,
	championshipsSelected: Number,
	robotPerformance: String,
	comments: String,
	ppw: Number,
	caStreak: {type: Number, default: 0},
	CAs: [{
		year: Number,
		caType: String,
//		type: String,
		location: {type: String, default: 'unknown'},
		essayLink: {type: String, default: 'N/A'},
		videoLink: {type: String, default: 'N/A'}
	}],
	EIAs: [{
		year: Number,
		location: {type: String, default: 'unknown'}
	}]
});

var sortNumberDesc = function(a, b) {
	return b.year - a.year;
}

var getCAStreak = function(caEntry, year) {
	//we need to sort...should be a small array, so performance is not a concern here
	caEntry.CAs.sort(sortNumberDesc);

	//we need to add the chairmans streak to the data
	caEntry.caStreak = 1;

	//we need to be in sequence
	var prevYear = year;
	for(var caIndex = 0; caIndex < caEntry.CAs.length; caIndex++) {
		if(prevYear - caEntry.CAs[caIndex].year <= 1) {
			if(prevYear !== caEntry.CAs[caIndex].year) { 
				caEntry.caStreak++;
			}
			prevYear = caEntry.CAs[caIndex].year;
		} else {
			//streak ended, break
			break;
		}
	}
	
	return caEntry.caStreak;
}

var getSummary = function(chairmansDataEntries, year) {
	
//	console.log(chairmansDataEntries);
	
	if(util.isArray(chairmansDataEntries)) {
		
//		var dataEntry;
		
		//create summary-level data for the team
		for(var index = 0; index < chairmansDataEntries.length; index++) {
//			dataEntry = chairmansDataEntries[index];

			chairmansDataEntries[index].caStreak = getCAStreak(chairmansDataEntries[index], year);
//			console.log(chairmansDataEntries[index]._id, chairmansDataEntries[index].caStreak, chairmansDataEntries[index].CAs);
		}
	} else {
		getCAStreak(chairmansDataEntries);
	}
	
	return chairmansDataEntries;
}

ChairmansSchema.statics.findSummary = function(currentYear, cb) {
	
	console.log("getting all chairmans records");
	
	//retrieve all team data...return immediately to keep async
	return this.find(function(err, chairmansDataEntries) {
		
		if(err) {
			cb(err,null);
		} else {
			console.log("getting all chairmans summaries", chairmansDataEntries.length);
			cb(err,getSummary(chairmansDataEntries, currentYear));
		}
		
	});
}

ChairmansSchema.statics.findByTeam = function(teamId, currentYear, cb) {
	return this.findById(function(err, chairmansDataEntries) {
		
		if(err) {
			cb(err,null);
		} else {
		
			cb(err,getSummary(chairmansDataEntries, currentYear));
		}
		
	});
}

mongoose.model('Chairmans', ChairmansSchema);