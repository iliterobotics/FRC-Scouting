//Angular Controller for teams listing
angular.module('ilite.common').controller('TeamListingCtrl', ['$scope','$location','$http','$interval','Team','auth','OfflineService', function($scope,$location,$http,$interval,Team,auth,OfflineService) {
  
	$http.defaults.headers.common.Authorization = 'Bearer '+auth.getToken();
  
	var teamListStorageKey = 'ilite-team-listing';
	
	var getTeamList = function() {
		Team.query().$promise.then(function(response) {
//			console.log(response);
			OfflineService.updateOfflineData(teamListStorageKey, response);
			$scope.teamList = response;
		}, function(err) {
			console.log('could not reach server, loading cached team listing');
			$scope.teamList = OfflineService.getOfflineData(teamListStorageKey);
		});
	}
	
	getTeamList();
	if(OfflineService.getRefreshInterval().value > 0) {
  	var teamRefresh = $interval(getTeamList, OfflineService.getRefreshInterval().value * 1000);
		$scope.$on('$destroy', function () { $interval.cancel(teamRefresh); });
	}

  this.viewTeam = function(teamNumber) {
    $location.path("/teams/"+teamNumber);
  }
  
  this.deleteTeam = function(team) {
    console.log('deleting team', team._id);
    team.$delete(
      //success
      function( value ){
        getTeamList();
      },
      //error
      function( error ){
				if(error.status === 0) {
        	OfflineService.updateDataRequest('TeamListing','listing',team,'delete');
				}
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