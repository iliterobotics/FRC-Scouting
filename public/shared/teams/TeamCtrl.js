//Angular Controller for team information
angular.module('ilite.common').controller('TeamCtrl', ['$scope','$routeParams','$location','Team', function($scope,$routeParams,$location,Team) {
  this.teamNumber = $routeParams.teamNumber;

  this.createMatch = function() {
    $location.path("/teams/"+this.teamNumber + "/matchInput");
  }
  
  this.viewMatch = function(matchId) {
    $location.path("/teams/"+this.teamNumber + "/matchInput" + matchId);
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamCtrl = this;
  
}]);