//Angular Controller for team information
angular.module('ilite.common').controller('TeamInputCtrl', ['$scope','$routeParams','$location','$http','Team','auth','OfflineService', function($scope,$routeParams,$location,$http,Team,auth,OfflineService) {
  this.title = 'Create Team';
  
	$http.defaults.headers.common.Authorization = 'Bearer '+auth.getToken();
																														
  if($routeParams.id) {
    Team.get({ teamId: $routeParams.id }).$promise.then(
      //success
      function( retrievedTeam ){
        $scope.TeamInputCtrl.title = 'Modify Team';
        $scope.TeamInputCtrl._id = retrievedTeam._id;
        $scope.TeamInputCtrl.name = retrievedTeam.name;
      },
      //error
      function( error ){
          $scope.TeamInputCtrl.error = err;
       }
    );
  }
  
  this.editTeam = function() {
    var team = new Team();
    team._id = this._id;
    team.name = this.name;
    
    //remove the old entry
    if($routeParams.id) {
      
      Team.delete({teamId: $routeParams.id});
    }
    
    //save the new entry
		team.execRequest = team.$save;
    team.execRequest(function() {
      //navigate back to the listings
      $location.path("/teamsListing");
    },
		function(err) {
//			console.log('error saving...adding to offline retry', err);
			if(err.status === 0) {
				console.log('error saving team...adding to offline retry');
				OfflineService.updateDataRequest('Team', team._id, team, 'save');
				$location.path("/teamsListing");
			} else {
				$scope.TeamInputCtrl.error = err;
				console.log(err);
			}
		});
    
    console.log(team);
  };
  
  this.updateTeam = function() {
  };
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamInputCtrl = this;
  
}]);