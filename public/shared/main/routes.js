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

    // route for the teams listing page
    .when('/teams', {
        templateUrl : 'shared/teams/teamsListing.html',
        controller  : 'TeamListingCtrl'
    })
  
    // route for the selected team information
    .when('/teams/:teamNumber', {
        templateUrl : 'shared/teams/team.html',
        controller  : 'TeamCtrl'
    });
  
    //TODO: add chairmans
  
//  $locationProvider.html5Mode(true);
  
});