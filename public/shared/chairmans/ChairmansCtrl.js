//Angular Controller for team information
angular.module('ilite.common').controller('ChairmansCtrl', ['$scope','$routeParams','$location','$http','Chairmans', 'auth', 'OfflineService', function($scope,$routeParams,$location,$http,Chairmans, auth, OfflineService) {
	
	$http.defaults.headers.common.Authorization = 'Bearer '+auth.getToken();
	
//  this.teamNumber = $routeParams.teamNumber;

	var chairmansTeamsStorageKey = 'ilite-chairmans-teams';
	var chairmansSummaryStorageKey = 'ilite-chairmans-summary';
	
	var getTeamSummary = function() {
		Chairmans.query().$promise.then(
			//success
			function( retrievedTeamData ){
				console.log(angular.toJson(retrievedTeamData));
				var chairmansTeams = [];
				for(var index = 0; index < retrievedTeamData.length; index++) {
					OfflineService.updateOfflineData(chairmansSummaryStorageKey + '-' + retrievedTeamData[index]._id, retrievedTeamData[index]);
					chairmansTeams.push(retrievedTeamData[index]._id);
				}

				OfflineService.updateOfflineData(chairmansTeamsStorageKey, chairmansTeams);

				$scope.ChairmansCtrl.chairmansData = retrievedTeamData;
			},
			//error
			function( error ){
				//load from cache
				console.log('could not reach server, loading cached team summaries');

				var chairmansListing = OfflineService.getOfflineData(chairmansTeamsStorageKey);
				$scope.ChairmansCtrl.chairmansData = [];

				for(var index = 0; index < chairmansListing.length; index++) {
					var teamId = chairmansListing[index];

					var chairmansSummary = OfflineService.getOfflineData(chairmansSummaryStorageKey + '-' + teamId);

					$scope.ChairmansCtrl.chairmansData.push(chairmansSummary);

				}			
			}
		);
	}
	
	getTeamSummary();
	
	if(OfflineService.getRefreshInterval().value > 0) {
  	var teamRefresh = $interval(getTeamSummary, OfflineService.getRefreshInterval().value * 1000);
		$scope.$on('$destroy', function () { $interval.cancel(teamRefresh); });
	}
  
  this.viewTeam = function(teamId) {
    $location.path("/chairmans/"+teamId);
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.ChairmansCtrl = this;
  
}]);