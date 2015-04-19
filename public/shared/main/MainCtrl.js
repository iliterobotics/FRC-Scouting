//Main angularjs controller...
angular.module('ilite.common').controller('MainCtrl', ['$scope','$interval','auth', 'OfflineService',
	function($scope, $interval, auth, OfflineService){
		this.isLoggedIn = auth.isLoggedIn;
		this.currentUser = auth.currentUser;
		this.logOut = auth.logOut;
		
		var offlineStorageRequestsKey = 'ilite-pending-requests';
		
		this.refreshOptions = [
			{ title: 'No Refresh', value: 0 },
			{ title: '10 seconds', value: 10 },
			{ title: '30 seconds', value: 30 },
			{ title: '1 minute', value: 60 },
			{ title: '5 minutes', value: 300 },
			{ title: '10 minutes', value: 600 },
			{ title: '30 minutes', value: 1800},
			{ title: '1 hour', value: 3600 }
		];
				
		this.refreshInterval = OfflineService.getRefreshInterval();
		
		this.updateRefreshRate = function() {
			OfflineService.setRefreshInterval(this.refreshInterval);
		}
		
		var pendingRefresh = $interval(function() {
			if($scope.MainCtrl.pendingRequests) {
				delete $scope.MainCtrl.pendingRequests
			}
			$scope.MainCtrl.pendingRequests = OfflineService.getPendingRequests();
		}, 1000);
		
		$scope.$on('$destroy', function () { $interval.cancel(pendingRefresh); });
		
		this.execPending = OfflineService.executePendingDataRequests;
		this.deleteRequest = OfflineService.removeDataRequest;
																												 
		$scope.MainCtrl = this;
	}]);