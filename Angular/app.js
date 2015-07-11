'use strict'

var hypeMap = angular.module('hypeMap', []);
console.log('up');

// SERVICES
hypeMap.service('hypeMapService', function() {
	console.log('test service');
	//TODO return dummy data (JSON)
});

// CONTROLLERS
hypeMap.controller('hypeMapController', ['$scope', 'hypeMapService', function($scope) {
	L.mapbox.accessToken = 'pk.eyJ1IjoiYW5nZWxoYWNrc3F1YWQiLCJhIjoiZDAwYmMwMTcwMzQ0NTdiMmUzMGJmNWZjNmFmOTI2OGYifQ.ifIhIKtHhbExiHiCXqFoIw';
	var map = L.mapbox.map('map', 'mapbox.streets').setView([40.723, -73.98], 14);

	var socket = io();
	socket.on('log', function(msg) {
		$('#msgwindow').append('<li class="log">' + msg);
	});

	socket.on('tweet', function(tweet) {
		//$('#msgwindow').append('<li class="tweet">' + "@" + tweet.user.screen_name + ': ' + tweet.text);
		if (tweet.geo && tweet.geo.coordinates && tweet.geo.coordinates[0] && tweet.geo.coordinates[1]) {
			$scope.mapTweet(tweet.geo.coordinates[0], tweet.geo.coordinates[1], tweet.text, tweet.user.screen_name);
		}
	});

	$scope.mapTweet = function(lat, lng, msg, usr) {
		console.log('Mapping (lat, lng): (' + lat + ', ' + lng + ')');

		if (!lat || !lng) {
			return;
		}

		L.mapbox.featureLayer({
	    type: 'Feature',
	    geometry: {
	        type: 'Point',
	        // coordinates here are in longitude, latitude order because
	        // x, y is the standard for GeoJSON and many formats
	        // coordinates: [-73.98, 40.723]
	        coordinates: [lng, lat]
	    },
	    properties: {
	        description: '<b>' + usr + '</b>' + ': ' + msg,
	        // one can customize markers by adding simplestyle properties
	        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
	        'marker-symbol': 'star',
	        'marker-size': 'small',
	        'marker-color': '#f44',
	    }
		}).addTo(map);
	}
}]);

