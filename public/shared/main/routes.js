angular.module('ilite.common').config(function($routeProvider, $locationProvider, $httpProvider) {
  
//	var checkLoggedin = function($q, $timeout, $http, $location, $window){ 
//		// Initialize a new promise 
//		var deferred = $q.defer();
//		
//		var token = $window.localStorage['ilite-scouting-token'];
//		
//		if(token){
//			var payload = JSON.parse($window.atob(token.split('.')[1]));
//
//			if(payload.exp > Date.now() / 1000) {
//				deferred.resolve(); 
//			} else {
//				deferred.reject(); 
//			}
//		} else {
//			deferred.reject(); 
//			$location.url('/login'); 
//		}
//		
//		return deferred.promise; 
//	}; 
	
	$routeProvider
    // route for the main page
    .when('/', {
        templateUrl : 'shared/main/main.html',
        controller  : 'MainCtrl'
    })
	
		//auth
		.when('/login', {
        templateUrl : 'shared/auth/login.html',
        controller  : 'AuthCtrl'
    })
	
		.when('/register', {
        templateUrl : 'shared/auth/register.html',
        controller  : 'AuthCtrl'
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
	
	$httpProvider.interceptors.push(function($q, $location) { 
		return { 
			response: function(response) { 
				// do something on success 
				return response; 
			}, responseError: function(response) { 
				if (response.status === 401) 
					$location.url('/login'); 
				return $q.reject(response); 
			} 
		}; 
	});
  
});