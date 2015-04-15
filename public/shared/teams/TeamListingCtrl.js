//Angular Controller for teams listing
angular.module('ilite.common').controller('TeamListingCtrl', ['$scope','$location','Team', function($scope,$location,Team) {
  
  $scope.teamList = Team.query();
  
  this.query = function () {
    return Team.query();
  };

  this.viewTeam = function(teamNumber) {
    $location.path("/teams/"+teamNumber);
  }
  
  this.deleteTeam = function(team) {
    console.log('deleting team', team._id);
    Team.delete({teamId : team._id }).$promise.then(
      //success
      function( value ){
        $scope.teamList= Team.query();
      },
      //error
      function( error ){
          alert(error);
       }
    );
  }
  
  this.modifyTeam = function(team) {
    console.log('modifying team', team);
  }
  
  this.addTeam = function() {
    $location.path("/teams/createTeam");
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamListingCtrl = this;
}]);