//Angular Factory for match api
//Format:
//Match
//	Alliance []
//    Name
//    Teams []
//    Total Score

angular.module('ilite.common').factory('Match', ['$resource', 'GameService', function ($resource, GameService) {

    //team #
    //team name
    return $resource('/v1/match/:matchId', {
        matchId: '@_id',
        gameId: GameService.name
    }, {
        update: {
            method: 'PUT'
        }
    });

}]);