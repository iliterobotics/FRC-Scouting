//Angular Controller for ranking table
angular.module('ilite.common').controller('RankingCtrl', ['$scope','$location','Team', function($scope,$location,Team) {

  //temporary for testing
  var sampleStats = {};
  sampleStats.teamId = 1885;
  sampleStats.totalAuto = 100;
  sampleStats.totalTotes = 200;
  sampleStats.totalCaps = 300;
  sampleStats.totalLitter = 160;
  sampleStats.totalCoop = 200;
  sampleStats.numberMatches = 10;
  sampleStats.scoringAvg = 200.56;
  
  var sampleStats1 = {};
  sampleStats1.teamId = 1000;
  sampleStats1.totalAuto = 100;
  sampleStats1.totalTotes = 200;
  sampleStats1.totalCaps = 0;
  sampleStats1.totalLitter = 160;
  sampleStats1.totalCoop = 200;
  sampleStats1.numberMatches = 10;
  sampleStats1.scoringAvg = 100.12;
  
  var sampleStats2 = {};
  sampleStats2.teamId = 2000;
  sampleStats2.totalAuto = 0;
  sampleStats2.totalTotes = 200;
  sampleStats2.totalCaps = 300;
  sampleStats2.totalLitter = 160;
  sampleStats2.totalCoop = 200;
  sampleStats2.numberMatches = 10;
  sampleStats2.scoringAvg = 20;
  
  $scope.teamStatistics = [];
  $scope.teamStatistics.push(sampleStats);
  $scope.teamStatistics.push(sampleStats1);
  $scope.teamStatistics.push(sampleStats2);
  
  this.viewTeam = function(teamId) {
    $location.path("/teams/"+teamId);
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.RankingCtrl = this;
  
}]);