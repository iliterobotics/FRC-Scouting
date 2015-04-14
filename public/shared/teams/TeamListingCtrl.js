//Angular Controller for teams listing
angular.module('ilite.common').controller('TeamListingCtrl', ['$scope','$location','Team', function($scope,$location,Team) {
  
  //sample for testing
  var teamInfo = {};
  teamInfo.teamId = 1885;
  teamInfo.teamName = 'ILITE Robotics';
  
  var teamInfo1 = {};
  teamInfo1.teamId = 2000;
  teamInfo1.teamName = 'ILITE Robotics1';
  
  var teamInfo2 = {};
  teamInfo2.teamId = 10;
  teamInfo2.teamName = 'ILITE Robotics2';
  
  $scope.teamList = [];
  $scope.teamList.push(teamInfo);
  $scope.teamList.push(teamInfo1);
  $scope.teamList.push(teamInfo2);
  
  this.query = function () {
    return Team.query();
  };

  this.viewTeam = function(teamNumber) {
    $location.path("/teams/"+teamNumber);
  }
  
  this.deleteTeam = function(teamNumber) {
    console.log('deleting team', teamNumber);
  }
  
  this.modifyTeam = function(teamNumber) {
    console.log('modifying team', teamNumber);
  }
  
  this.addTeam = function() {
    $location.path("/teams/createTeam");
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamListingCtrl = this;
}]);