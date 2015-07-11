'use strict'

var hypeMap = angular.module('hypeMap', []);
console.log("test");

// SERVICES

// CONTROLLERS
hypeMap.controller('hypeMapController', function($scope) {

	//Initial Value
	$scope.data = {};
	console.log("blah blah blah");
	$scope.mapTweets = function() {
		console.log("Map all the tweets!!");
	}
});