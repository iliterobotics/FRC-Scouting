//pseudo persistent storage for requests
//this class serves 2 purposes:
//1. Cache data when wanted
//2. Retry failed requests due to network connectivity
angular.module('ilite.common').service('OfflineService', ['$window', '$interval','$http', 'Team', 'Match', 'TeamMatchData', 'auth', function($window, $interval, $http, Team, Match, TeamMatchData, auth){
	
	var offlineStorageRequestsKey = 'ilite-pending-requests';
	
	var refreshInterval = { title: 'No Refresh', value: 0 };
	var numRetries = 3;
	
	$http.defaults.headers.common.Authorization = 'Bearer '+auth.getToken();
	
	//list of keys for POST
	//object is persisted
	//saveRequests.<localStorageKey> = { type: {SAVE/UPDATE/DELETE} };
	var pendingRequests = angular.fromJson($window.localStorage.getItem(offlineStorageRequestsKey));
	
	if(!pendingRequests) {
		pendingRequests = {};
	}
	
	var poller = null;
	
	var offlineService = this;
	
	this.setRefreshInterval = function(interval) {
		refreshInterval = interval;
	}
	
	this.getRefreshInterval = function() {
		return refreshInterval;
	}
		
	this.updateDataRequest = function(requestType, requestId, requestObject, requestAction, requestParams) {
		
		//key is <type>-<objectid>-<action>
		var requestKey = requestType + '-' + requestId + '-' + requestAction;
		
		//mapping entry for this data
		//overwrite previous unique key if exists
		pendingRequests[requestKey] = {
//				key: requestKey,
				type: requestType,
				payload: requestObject,
				action: requestAction,
				params: requestParams
			};
		
		//add the data to the local storage
		$window.localStorage.setItem(offlineStorageRequestsKey, angular.toJson(pendingRequests));
		
		console.log('adding pending request due to loss of network',requestKey,requestObject, pendingRequests[requestKey]);
		
		if(!poller) {
			pollPendingRequests();
		}
	}
	
	this.getPendingRequests = function() {
		return Object.keys(pendingRequests);
	}
	
	this.removeDataRequest = function(requestKey) {
		
		if(pendingRequests[requestKey]) {
			delete pendingRequests[requestKey];
			$window.localStorage.setItem(offlineStorageRequestsKey, angular.toJson(pendingRequests));
		}
		
	}
	
	this.executePendingDataRequests = function() {
		angular.forEach(pendingRequests, function(serverRequest, key) {

			console.log('serving pending request',serverRequest);

			var responseSuccess = function(data) {
				//cleanup the request since it is no longer pending...
				console.log('Request',key,'was successful...cleaning up');
				offlineService.removeDataRequest(key);
			}

			//if we get an error verify the error is a connection issue
			//if the error is a connection issue, keep data in the list
			var responseError = function(err) {
				if(err.status !== 0 && err.status !== 401) {
					console.log('Request',key,'errored, removing',angular.toJson(err));
					offlineService.removeDataRequest(key);
				}
			}

			var RequestingObject = null;
			
			if(serverRequest.type === 'Team') {
				RequestingObject = Team;
			} else if(serverRequest.type === 'Match') {
				RequestingObject = Match;
			} else if(serverRequest.type === 'TeamMatchData') {
				RequestingObject = TeamMatchData;
			}
			
			var request = new RequestingObject(serverRequest.payload);
			
			console.log(request);
			
			//handle the request
			//if there are params this is a regular $resource/$http call
			if(serverRequest.params) {
				
				if(serverRequest.action === 'save') {
					RequestingObject.save(serverRequest.params).then(
						responseSuccess,
						responseError
					);
				} else if(serverRequest.action === 'update') {
					RequestingObject.update(serverRequest.params).then(
						responseSuccess,
						responseError
					);
				} else if(serverRequest.action === 'delete') {
					RequestingObject.delete(serverRequest.params).then(
						responseSuccess,
						responseError
					);
				}
				
			} else {
				
				if(serverRequest.action === 'save') {
					request.$save().then(
						responseSuccess,
						responseError
					);
				} else if(serverRequest.action === 'update') {
					request.$update().then(
						responseSuccess,
						responseError
					);
				} else if(serverRequest.action === 'delete') {
					request.$delete().then(
						responseSuccess,
						responseError
					);
				}

			}
		});
	}
	
	this.updateOfflineData = function(storageKey, data) {
		$window.localStorage.setItem(storageKey, angular.toJson(data));
	}
	
	this.getOfflineData = function (storageKey) {
		return angular.fromJson($window.localStorage.getItem(storageKey));
	}
	
	this.removeOfflineData = function(storageKey) {
		$window.localStorage.removeItem(storageKey);
	}
	
	var pollPendingRequests = function() {
		poller = $interval(function() {
		
			//ensure that the retry interval is > 0
			if(refreshInterval.value <= 0 || Object.keys(pendingRequests).length <= 0) {
				console.log('cancelling poll request...retry not active');
				$interval.cancel(poller);
				poller = null;
			}
			
			offlineService.executePendingDataRequests();

	//		$interval.cancel(pollRequests);
		}, refreshInterval.value * 1000);
	}
	
}]);