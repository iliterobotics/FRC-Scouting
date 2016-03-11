//Angular Controller for team information
angular.module('ilite.common').controller('TeamDataCtrl', ['$scope', '$routeParams', '$location', '$http', 'Match', 'TeamMatchData', 'auth', 'OfflineService', 'GameService', function ($scope, $routeParams, $location, $http, Match, TeamMatchData, auth, OfflineService, GameService) {

    $http.defaults.headers.common.Authorization = 'Bearer ' + auth.getToken();

    this.teamNumber = $routeParams.teamNumber;

    var teamSummaryStorageKey = 'ilite-team-summary';

    TeamMatchData.get({
        gameId: GameService.name,
        teamId: this.teamNumber
    }).$promise.then(
        //success
        function (retrievedTeamData) {
            console.log(angular.toJson(retrievedTeamData[$scope.TeamDataCtrl.teamNumber]));
            $scope.TeamDataCtrl.teamData = retrievedTeamData[$scope.TeamDataCtrl.teamNumber];
        },
        //error
        function (error) {
            //load from cache
            $scope.TeamDataCtrl.teamData = OfflineService.getOfflineData(teamSummaryStorageKey + '-' + $scope.TeamDataCtrl.teamNumber);

        }
    );

    //  this.createMatch = function() {
    //    $location.path("/teams/"+this.teamNumber + "/editData");
    //  }

    this.modifyMatch = function (matchId) {
        $location.path("/teams/" + this.teamNumber + "/editData").search('matchNumber', matchId);
    }

    //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
    return $scope.TeamDataCtrl = this;

}]);