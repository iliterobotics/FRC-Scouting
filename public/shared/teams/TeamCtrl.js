//Angular Controller for team information
angular.module('ilite.common').controller('TeamCtrl', ['$scope','$routeParams','Team', function($scope,$routeParams,Team) {
  $scope.teamNumber = $routeParams.teamNumber;

}]);