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
	L.mapbox.accessToken = 'pk.eyJ1IjoiYW5nZWxoYWNrc3F1YWQiLCJhIjoiZDAwYmMwMTcwMzQ0NTdiMmUzMGJmNWZjNmFmOTI2OGYifQ.ifIhIKtHhbExiHiCXqFoIw';

	var map = L.mapbox.map('map', 'mapbox.streets').setView([40.723, -73.98], 14);

	//console.log('mapd');
	/*L.mapbox.featureLayer({
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: [-73.98, 40.723]
    },
    properties: {
        title: 'Peregrine Espresso',
        description: '1718 14th St NW, Washington, DC',
        // one can customize markers by adding simplestyle properties
        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
        'marker-size': 'large',
        'marker-color': '#BE9A6B',
        'marker-symbol': 'cafe'
    }
	}).addTo(map);*/

	var socket = io();
	socket.on('log', function(msg) {
		$('#msgwindow').append('<li class="log">' + msg);
	});

	//TODO Add marker to map (can call mapTweets function)
	socket.on('tweet', function(tweet){
		//$('#msgwindow').append('<li class="tweet">' + tweet.user.name + " (@" +
		//tweet.user.screen_name + '): ' + tweet.text + ' | ' + tweet.geo.coordinates[0] + ', ' + tweet.geo.coordinates[1]);
		$scope.mapTweet(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
		//console.log(tweet);
	});

	/*window.setTimeout(function() {
		console.log("asdfasdf");
        $scope.mapTweet();
  }, 500);*/

	//Functions
	$scope.mapTweet = function(lat, lng) {
		console.log("Mapping...!!!");
		console.log("lat: " + lat);
		console.log("lng: " + lng);

		if (!lat || !lng) {
			return;
		}

		L.mapbox.featureLayer({
	    type: 'Feature',
	    geometry: {
	        type: 'Point',
	        // coordinates here are in longitude, latitude order because
	        // x, y is the standard for GeoJSON and many formats
	        //coordinates: [-73.98, 40.723]
	        coordinates: [lng, lat]
	    },
	    properties: {
	        title: 'Peregrine Espresso',
	        description: '1718 14th St NW, Washington, DC',
	        // one can customize markers by adding simplestyle properties
	        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
	        'marker-size': 'large',
	        'marker-color': '#BE9A6B',
	        'marker-symbol': 'cafe'
	    }
		}).addTo(map);
	}
}]);

