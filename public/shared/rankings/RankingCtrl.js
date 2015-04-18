//Angular Controller for ranking table
angular.module('ilite.common').controller('RankingCtrl', ['$scope','$location','$http','TeamMatchData','auth', function($scope,$location,$http,TeamMatchData,auth) {

	this.teamDataList = [];
	
	$http.defaults.headers.common.Authorization = 'Bearer '+auth.getToken();
	
  TeamMatchData.get().$promise.then(
		//success
		function( retrievedTeamData ){
			
			$scope.RankingCtrl.teamDataList = [];
			
			for(var teamId in retrievedTeamData) {
				if(retrievedTeamData[teamId].team) {
//					console.log(retrievedTeamData[teamId]);
					retrievedTeamData[teamId].average = retrievedTeamData[teamId].total/retrievedTeamData[teamId].matches.length;
        	$scope.RankingCtrl.teamDataList.push(retrievedTeamData[teamId]);
				}
    	}
		},
		//error
		function( error ){
			alert(error);
		}
	);
  
  this.viewTeam = function(teamId) {
    $location.path("/teams/"+teamId);
  }
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.RankingCtrl = this;
  
}]);