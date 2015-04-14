//Angular Factory for match api
//Format:
//Match
//	Alliance []
//    Name
//    Teams []
//    Total Score

angular.module('ilite.common').factory('Match', ['$resource', function($resource) {

  //team #
  //team name
  return $resource('/v1/match/:matchId', { matchId: '@id'},
               {
                 update: { method: 'PUT' }
               });    

}]);