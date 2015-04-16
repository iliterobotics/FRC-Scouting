//Angular Controller for team information
angular.module('ilite.common').controller('TeamInputCtrl', ['$scope','$routeParams','$location','Team', function($scope,$routeParams,$location,Team) {
  this.title = 'Create Team';
  
  if($routeParams.id) {
    Team.get({ teamId: $routeParams.id }).$promise.then(
      //success
      function( retrievedTeam ){
        $scope.TeamInputCtrl.title = 'Modify Team';
        $scope.TeamInputCtrl._id = retrievedTeam._id;
        $scope.TeamInputCtrl.name = retrievedTeam.name;
      },
      //error
      function( error ){
          alert(error);
       }
    );
  }
  
  this.editTeam = function() {
    var team = new Team();
    team._id = this._id;
    team.name = this.name;
    
    //remove the old entry
    if($routeParams.id) {
      
      Team.delete({teamId: $routeParams.id});
    }
    
    //save the new entry
    team.$save(function() {
      //navigate back to the listings
      $location.path("/teamsListing");
    });
    
    console.log(team);
  };
  
  this.updateTeam = function() {
  };
  
  //allows for more readable html (angular call is <ControllerName>.<function> vs <function>
  return $scope.TeamInputCtrl = this;
  
}]);