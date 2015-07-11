'use strict'

var hypeMap = angular.module('hypeMap', []);
console.log("test");

// SERVICES
hypeMap.service('hypeMapService', function() {
	console.log("testService");
});

// CONTROLLERS
hypeMap.controller('hypeMapController', ['$scope', 'hypeMapService', function($scope) {

	//Initial Value
	$scope.data = {};

	//Functions
	$scope.mapTweets = function() {
		console.log("Map all the tweets!!");
	}
}]);

