//Angular Controller for team information
angular.module('ilite.common').controller('TeamDataCtrl', ['$scope','$routeParams','$location','Match','TeamMatchData', function($scope,$routeParams,$location,Match,TeamMatchData) {
  this.teamNumber = $routeParams.teamNumber;

	TeamMatchData.get({ teamId: this.teamNumber }).$promise.then(
		//success
		function( retrievedTeamData ){
			console.log(angular.toJson(retrievedTeamData[$scope.TeamDataCtrl.teamNumber]));
			$scope.TeamDataCtrl.teamData = retrievedTeamData[$scope.TeamDataCtrl.teamNumber];
		},
		//error
		function( error ){
			alert(error);
		}
	);
	
//  this.createMatch = function() {
//    $location.path("/teams/"+this.teamNumber + "/editData");
//  }
  
  this.modifyMatch = function(matchId) {
    $location.path("/teams/"+this.teamNumber + "/editData").search('matchNumber', matchId);
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamDataCtrl = this;
  
}]);