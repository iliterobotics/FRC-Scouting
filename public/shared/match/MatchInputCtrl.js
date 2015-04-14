//Angular Controller for matches
angular.module('ilite.common').controller('MatchInputCtrl', ['$scope','$routeParams', function($scope,$routeParams) {
  
  this.teamNumber = $routeParams.teamNumber;
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.MatchInputCtrl = this;
  
}]);