//Angular Controller for team information
angular.module('ilite.common').controller('TeamInputCtrl', ['$scope','$routeParams','$location','Team', function($scope,$routeParams,$location,Team) {
  this.createTeam = function() {
    console.log('creating team');
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamInputCtrl = this;
  
}]);