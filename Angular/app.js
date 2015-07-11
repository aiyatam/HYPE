'use strict'

var hypeMap = angular.module('hypeMap', []);
console.log("test");

// SERVICES
hypeMap.service('hypeMapService', function() {
	console.log("testService");
	//TODO return dummy data (JSON)
});

// CONTROLLERS
hypeMap.controller('hypeMapController', ['$scope', 'hypeMapService', function($scope) {

	function initialize() {
		var mapCanvas = document.getElementById('map-canvas');
		var mapOptions = {
		  center: new google.maps.LatLng(40.7127, -74.0059),
		  zoom: 8,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(mapCanvas, mapOptions)
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	//Initial Value
	$scope.data = {};

	//Functions
	$scope.mapTweets = function() {
		console.log("Map all the tweets!!");
	}
}]);

