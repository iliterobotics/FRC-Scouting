//Angular Factory for teams api
angular.module('ilite.common').factory('Team', ['$resource', function($resource) {

  //team #
  //team name
  return $resource('/v1/teams/:teamId', { teamId: '@_id'},
               {
                 update: { method: 'PUT' }
               });    

}]);