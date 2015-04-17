//Angular Controller for team information
angular.module('ilite.common').controller('TeamMatchDataCtrl', ['$scope','$routeParams','$location','TeamMatchData', function($scope,$routeParams,$location,TeamMatchData) {
  this.teamNumber = $routeParams.teamNumber;
	this.matchNumber = $routeParams.matchNumber;
	
	//default model
	this.matchData = new TeamMatchData({
		team: this.teamNumber,
		match: this.matchNumber,
		autonomous: {
			toteSet: false,
			numCans: 0,
			numTotes: 0,
			isInAutoZone:	false
		},
		stacks: [],
		caps: [],
		burglar: {
			efficiency: 0,
			autonomous: false,
			cansAttempted: 0,
			cansCaptured: 0,
			battle: 'No Battle'
		},
		ramp: {
			quantity: 0,
			toteCapacity: 0,
			numCycles: 0,
			interferes: false
		},
		coop: {
			numberTotes: 0,
			type: 'Top',
			efficiency: 0
		}
	});
	
	TeamMatchData.get({teamId: this.teamNumber, matchId: this.matchNumber}).$promise.then(
		//success
		function( retrievedTeamData ){
			console.log(retrievedTeamData);
			if(retrievedTeamData._id) {
				$scope.TeamMatchDataCtrl.matchData = new TeamMatchData(retrievedTeamData);
			}
		},
		//error
		function( error ){
			alert(error);
		}
	);
	
	this.addStack = function() {
		this.matchData.stacks.push({ height: 0, location: 'HP' });
	}
	
	this.addCap = function() {
		this.matchData.caps.push({ height: 0, litter: false });
	}
	
	this.saveMatch = function() {
		if(this.matchData._id) {
			console.log('updating match data entry',this.matchData.team,this.matchData.match,this.matchData._id);
			this.matchData.$update(function() {
				//navigate back to the listings
				$location.path("/teams/" + $scope.TeamMatchDataCtrl.teamNumber);
			});
		} else {
			console.log('saving match data entry',this.matchData.team,this.matchData.match);
			
			//save the new entry
			this.matchData.$save(function() {
				//navigate back to the listings
				$location.path("/teams/" + $scope.TeamMatchDataCtrl.teamNumber);
			});
		}
	}
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamMatchDataCtrl = this;
  
}]);