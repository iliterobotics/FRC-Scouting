//Angular Controller for team information
angular.module('ilite.common').controller('TeamInputCtrl', ['$scope','$routeParams','$location','Team', function($scope,$routeParams,$location,Team) {
  
  this.createTeam = function() {
    var team = new Team();
    team.number = this.number;
    team.name = this.name;
    console.log(team);    
    team.$save(function() {
      $location.path("/teams");
    });
  };
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamInputCtrl = this;
  
}]);