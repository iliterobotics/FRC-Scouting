//Angular Factory for chairmans api
angular.module('ilite.common').factory('Chairmans', ['$resource', function($resource) {

  //team #
  //team name
  return $resource('/v1/chairmans/:teamId', { teamId: '@_id'},
               {
                 update: { method: 'PUT' }
               });    

}]);