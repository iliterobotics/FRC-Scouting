//Angular Controller for ranking table
angular.module('ilite.common').controller('RankingCtrl', ['$scope', '$location', '$http', '$interval', 'TeamMatchData', 'auth', 'OfflineService', 'GameService', function ($scope, $location, $http, $interval, TeamMatchData, auth, OfflineService, GameService) {

    this.teamDataList = [];

    $http.defaults.headers.common.Authorization = 'Bearer ' + auth.getToken();

    var teamSummaryStorageKey = 'ilite-team-summary';
    var teamListStorageKey = 'ilite-team-listing';

    var getTeamSummary = function () {

        TeamMatchData.get({
            gameId: GameService.name
        }).$promise.then(
            //success
            function (retrievedTeamData) {

                $scope.RankingCtrl.teamDataList = [];

                for (var teamId in retrievedTeamData) {
                    if (retrievedTeamData[teamId].team) {
                        OfflineService.updateOfflineData(teamSummaryStorageKey + '-' + teamId, retrievedTeamData[teamId]);
                        //					console.log(retrievedTeamData[teamId]);
                        retrievedTeamData[teamId].average = retrievedTeamData[teamId].total / (retrievedTeamData[teamId].completedMatches > 0 ? retrievedTeamData[teamId].completedMatches : 1);
                        $scope.RankingCtrl.teamDataList.push(retrievedTeamData[teamId]);
                    }
                }
            },
            //error
            function (error) {
                console.log('could not reach server, loading cached team summaries');

                var teamListing = OfflineService.getOfflineData(teamListStorageKey);
                $scope.RankingCtrl.teamDataList = [];

                for (var index = 0; index < teamListing.length; index++) {
                    var teamId = teamListing[index]._id;
                    var teamSummary = OfflineService.getOfflineData(teamSummaryStorageKey + '-' + teamId);
                    if (teamSummary.team) {
                        teamSummary.average = teamSummary.total / teamSummary.completedMatches;
                        $scope.RankingCtrl.teamDataList.push(teamSummary);
                    }
                }
            }
        );
    }

    getTeamSummary();

    if (OfflineService.getRefreshInterval().value > 0) {
        var teamRefresh = $interval(getTeamSummary, OfflineService.getRefreshInterval().value * 1000);
        $scope.$on('$destroy', function () {
            $interval.cancel(teamRefresh);
        });
    }

    this.viewTeam = function (teamId) {
        $location.path("/teams/" + teamId);
    }

    //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
    return $scope.RankingCtrl = this;

}]);