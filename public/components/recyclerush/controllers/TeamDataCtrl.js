//Angular Controller for team information
angular.module('ilite.common').controller('TeamDataCtrl', ['$scope','$routeParams','$location','Match','TeamMatchData', function($scope,$routeParams,$location,Match,TeamMatchData) {
  this.teamNumber = $routeParams.teamNumber;

	this.matches = Match.query({ teamNumber: this.teamNumber });
	
//  this.createMatch = function() {
//    $location.path("/teams/"+this.teamNumber + "/editData");
//  }
  
  this.modifyMatch = function(matchId) {
    $location.path("/teams/"+this.teamNumber + "/editData").search('matchNumber', matchId);
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamDataCtrl = this;
  
}]);