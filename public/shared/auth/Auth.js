angular.module('ilite.common').factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

	auth.saveToken = function (token){
		$window.localStorage['ilite-scouting-token'] = token;
	};

	auth.getToken = function (){
		return $window.localStorage['ilite-scouting-token'];
	};
	
	auth.isLoggedIn = function(){
		var token = auth.getToken();

		if(token){
			var payload = angular.fromJson($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};
	
	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = angular.fromJson($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};
	
	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	};
	
	auth.logIn = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	};
	
	auth.logOut = function(){
		$window.localStorage.removeItem('ilite-scouting-token');
	};
	
  return auth;
}]).controller('AuthCtrl', [
'$scope',
'$location',
'auth',
function($scope, $location, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $location.path("/");
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $location.path("/");
    });
  };
	
	$scope.logOut = function(){
    auth.logOut();
      $location.path("/");
  };
}]);