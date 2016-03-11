//Angular Controller for team information
angular.module('ilite.common').controller('TeamMatchDataCtrl', ['$scope', '$routeParams', '$location', '$http', 'TeamMatchData', 'auth', 'OfflineService', 'GameService', function ($scope, $routeParams, $location, $http, TeamMatchData, auth, OfflineService, GameService) {
    this.teamNumber = $routeParams.teamNumber;
    this.matchNumber = $routeParams.matchNumber;

    $http.defaults.headers.common.Authorization = 'Bearer ' + auth.getToken();

    //default model
    this.matchData = GameService.matchData(this.teamNumber, this.matchNumber);

    this.matchData.$get().then(
        //success
        function (retrievedTeamData) {
            console.log(retrievedTeamData);
            if (retrievedTeamData._id) {
                $scope.TeamMatchDataCtrl.matchData = new TeamMatchData(retrievedTeamData);
                $scope.TeamMatchDataCtrl.matchData.game = GameService.name;
            }
        },
        //error
        function (err) {
            $scope.TeamMatchDataCtrl.error = err;
        }
    );

    this.addStack = function () {
        this.matchData.stacks.push({
            height: 0,
            location: 'HP'
        });
    }

    this.selectStack = function (idx) {
        this.selectedStack = idx;
    }

    this.deleteStack = function (idx) {
        this.matchData.stacks.splice(idx, 1);
        this.selectedStack = null;
    }

    this.addCap = function () {
        this.matchData.caps.push({
            height: 0,
            litter: false
        });
    }

    this.selectCap = function (idx) {
        this.selectedCap = idx;
    }

    this.deleteCap = function (idx) {
        this.matchData.caps.splice(idx, 1);
        this.selectedCap = null;
    }

    this.saveMatch = function () {
        this.matchData.completed = true;
        if (this.matchData._id) {
            console.log('updating match data entry', this.matchData.team, this.matchData.match, this.matchData._id);
            this.matchData.$update(function () {
                //navigate back to the listings
                $location.path("/teams/" + $scope.TeamMatchDataCtrl.teamNumber);
            }, function (err) {
                if (err.status === 0) {
                    console.log('error updating team match data...adding to offline retry');
                    OfflineService.updateDataRequest('TeamMatchData', $scope.TeamMatchDataCtrl.matchData._id, $scope.TeamMatchDataCtrl.matchData, 'update');
                    $location.path("/teams/" + $scope.TeamMatchDataCtrl.teamNumber);
                } else {
                    $scope.TeamMatchDataCtrl.error = err;
                    console.log(err);
                }
            });
        } else {
            console.log('saving match data entry', this.matchData.team, this.matchData.match);

            //save the new entry
            this.matchData.$save(function () {
                //navigate back to the listings
                $location.path("/teams/" + $scope.TeamMatchDataCtrl.teamNumber);
            }, function (err) {
                if (err.status === 0) {
                    console.log('error saving team match data...adding to offline retry');
                    OfflineService.updateDataRequest('TeamMatchData', $scope.TeamMatchDataCtrl.matchData.team + '-' + $scope.TeamMatchDataCtrl.matchData.match, $scope.TeamMatchDataCtrl.matchData, 'save');
                    $location.path("/teams/" + $scope.TeamMatchDataCtrl.teamNumber);
                } else {
                    $scope.TeamMatchDataCtrl.error = err;
                    console.log(err);
                }
            });
        }
    }

    //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
    return $scope.TeamMatchDataCtrl = this;

}]);