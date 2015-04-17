angular.module('ilite.routes').config(function($routeProvider, $locationProvider) {
  $routeProvider
    // route for the main page
    .when('/', {
        templateUrl : 'shared/main/main.html',
        controller  : 'MainCtrl'
    })

    // route for the rankings page
    .when('/rankings', {
        templateUrl : 'shared/rankings/rankings.html',
        controller  : 'RankingCtrl'
    })
  
    // route for the rankings page
    .when('/matches', {
        templateUrl : 'shared/match/matchListing.html',
        controller  : 'MatchCtrl'
    })
	
		.when('/matches/edit', {
        templateUrl : 'shared/match/editMatch.html',
        controller  : 'MatchEditCtrl'
    })
	
		.when('/matches/edit/:id', {
        templateUrl : 'shared/match/editMatch.html',
        controller  : 'MatchEditCtrl'
    })

    // route for the teams listing page
    .when('/teamsListing', {
        templateUrl : 'shared/teams/teamsListing.html',
        controller  : 'TeamListingCtrl'
    })
  
    .when('/teamsListing/teamInput/:id', {
        templateUrl : 'shared/teams/teamInput.html',
        controller  : 'TeamInputCtrl'
    })
  
    .when('/teamsListing/teamInput', {
        templateUrl : 'shared/teams/teamInput.html',
        controller  : 'TeamInputCtrl'
    })
  
    // route for the selected team information
    .when('/teams/:teamNumber', {
        templateUrl : 'components/recyclerush/views/teamData.html',
        controller  : 'TeamDataCtrl'
    })
  
    // route for entering match data
		//optional: ?matchNumber=<matchNumber>
		.when('/teams/:teamNumber/editData', {
        templateUrl : 'components/recyclerush/views/teamMatchData.html',
        controller  : 'TeamMatchDataCtrl'
    });
  
    //TODO: add chairmans
  
//  $locationProvider.html5Mode(true);
  
});