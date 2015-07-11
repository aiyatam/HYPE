var hypeMap = angular.module('hypeMap', [ngRoute]);

// SERVICES

// CONTROLLERS
hypeMap.controller('hypeMapController', function($scope) {
	// Initial Value
	$scope.data = {};

	$scope.mapTweets = function() {
		console.log("Map all the tweets!!");
	}
});