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
	// MAP BOX ISH
	mapboxgl.accessToken = 'pk.eyJ1IjoiYW5nZWxoYWNrc3F1YWQiLCJhIjoiZDAwYmMwMTcwMzQ0NTdiMmUzMGJmNWZjNmFmOTI2OGYifQ.ifIhIKtHhbExiHiCXqFoIw';
	
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'https://www.mapbox.com/mapbox-gl-styles/styles/outdoors-v7.json', //stylesheet location
		center: [40.7127, -74.0059], // starting position
		zoom: 12 // starting zoom
	});

	//Initial Value
	$scope.data = {};

	var socket = io();
	socket.on('log', function(msg) {
		$('#msgwindow').append('<li class="log">' + msg);
	});

	//TODO Add marker to map (can call mapTweets function)
	socket.on('tweet', function(tweet){
		$('#msgwindow').append('<li class="tweet">' + tweet.user.name + " (@" +
		tweet.user.screen_name + '): ' + tweet.text + ' | ' +
		tweet.geo.coordinates[0] + ', ' + tweet.geo.coordinates[1]);
		console.log(tweet);
	});

	//Functions
	$scope.mapTweets = function() {
		console.log("Map all the tweets!!");
	}
}]);

