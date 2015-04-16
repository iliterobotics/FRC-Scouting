//Angular Controller for matches
angular.module('ilite.common').controller('MatchCtrl', ['$scope','$location','Match', function($scope,$location,Match) {
  
  $scope.matches = Match.query();
  
	this.selectMatch = function(matchId) {
		if(!$scope.selectedMatchId) {
			$scope.selectedMatchId = matchId;
		} else {
			$scope.selectedMatchId = null;
		}
	}
	
	this.addMatch = function() {
		$location.path("/matches/edit");
	};
	
	this.modifyMatch = function() {
		$location.path("/matches/edit/" + $scope.selectedMatchId);
	};
	
	this.deleteMatch = function() {
		Match.delete({ matchId : $scope.selectedMatchId}).$promise.then(function(res) {
				$scope.matches = Match.query();
			},
			function(err) {
				alert(err);
			});
	};
	
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.MatchCtrl = this;
  
}]);

angular.module('ilite.common').controller('MatchEditCtrl', ['$scope','$location','$routeParams','Match', function($scope,$location,$routeParams,Match) {
  
	if($routeParams.id) {
    Match.get({ matchId: $routeParams.id }).$promise.then(
      //success
      function( retrievedMatch ){
        $scope.MatchEditCtrl.title = 'Modify Team';
        $scope.MatchEditCtrl._id = retrievedMatch._id;
				
        $scope.MatchEditCtrl.red1 = retrievedMatch.alliances[0].teams[0];
				$scope.MatchEditCtrl.red2 = retrievedMatch.alliances[0].teams[1];
				$scope.MatchEditCtrl.red3 = retrievedMatch.alliances[0].teams[2];
				$scope.MatchEditCtrl.redScore = retrievedMatch.alliances[0].score;
				
				$scope.MatchEditCtrl.blue1 = retrievedMatch.alliances[1].teams[0];
				$scope.MatchEditCtrl.blue2 = retrievedMatch.alliances[1].teams[1];
				$scope.MatchEditCtrl.blue3 = retrievedMatch.alliances[1].teams[2];
				$scope.MatchEditCtrl.blueScore = retrievedMatch.alliances[1].score;
      },
      //error
      function( error ){
          alert(error);
       }
    );
  }
	
	this.saveMatch = function() {
    var match = new Match();
    match._id = this._id;
    
		match.alliances = [];
		
		var redAlliance = {};
		redAlliance.name = 'Red';
		redAlliance.teams = [this.red1,
												 this.red2,
												 this.red3];
		
		redAlliance.score = this.redScore;
		
		var blueAlliance = {};
		blueAlliance.name = 'Blue';
		blueAlliance.teams = [this.blue1,
												 this.blue2,
												 this.blue3];
		
		blueAlliance.score = this.blueScore;
		
		match.alliances.push(redAlliance);
		match.alliances.push(blueAlliance);
		
    //remove the old entry
    if($routeParams.id) {
      
      Match.delete({matchId: $routeParams.id}).$promise.then(function(res) {
				//save the new entry
				match.$save(function() {
					//navigate back to the listings
					$location.path("/matches");
				});
			},
			function(err) {
				//save the new entry
				match.$save(function() {
					//navigate back to the listings
					$location.path("/matches");
				});
			});
    }
    
    console.log(match);
  };
	
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.MatchEditCtrl = this;
  
}]);