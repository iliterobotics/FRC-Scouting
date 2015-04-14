//Angular Controller for matches
angular.module('ilite.common').controller('MatchCtrl', ['$scope','Match', function($scope,Match) {

  //sample match object for testing...
  var sampleMatch = {};
  sampleMatch.id = 1;
  sampleMatch.alliances = [];
  
  var sampleMatch1 = {};
  sampleMatch1.id = 2;
  sampleMatch1.alliances = [];
  
  var redAlliance = {};
  redAlliance.name = 'red';
  redAlliance.teams = [];
  redAlliance.teams.push(1885);
  redAlliance.teams.push(16);
  redAlliance.teams.push(5000);
  redAlliance.score = 200;
  
  var blueAlliance = {};
  blueAlliance.name = 'blue';
  blueAlliance.teams = [];
  blueAlliance.teams.push(1885);
  blueAlliance.teams.push(25);
  blueAlliance.teams.push(5100);
  blueAlliance.score = 168;
  
  sampleMatch.alliances.push(redAlliance);
  sampleMatch.alliances.push(blueAlliance);
  
  sampleMatch1.alliances.push(redAlliance);
  sampleMatch1.alliances.push(blueAlliance);
  
  $scope.matches = [];
  $scope.matches.push(sampleMatch);
  $scope.matches.push(sampleMatch1);
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.MatchCtrl = this;
  
}]);