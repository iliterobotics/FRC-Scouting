//Angular Controller for teams listing
angular.module('ilite.common').controller('TeamListingCtrl', ['$scope','$location','$http','Team','auth', function($scope,$location,$http,Team,auth) {
  
	$http.defaults.headers.common.Authorization = 'Bearer '+auth.getToken();
	console.log(auth.getToken());
  $scope.teamList = Team.query();
  
  this.query = function () {
    return Team.query();
  };

  this.viewTeam = function(teamNumber) {
    $location.path("/teams/"+teamNumber);
  }
  
  this.deleteTeam = function(team) {
    console.log('deleting team', team._id);
    team.$delete(
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
    $location.path("/teamsListing/teamInput/" + team._id);
  }
  
  this.addTeam = function() {
    $location.path("/teamsListing/teamInput");
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamListingCtrl = this;
}]);