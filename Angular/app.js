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

	var socket = io();
	// Handle sending messages
	$('#chat-window form').submit(function() {
		if ($.trim($('#m').val())) {
			var chatData = { msg: $('#m').val()};
			var chatJSON = JSON.stringify(chatData);
		    socket.emit('chat message', chatJSON);
		    $('#m').val('');
		}
	    return false;
	});


	socket.on('log', function(msg) {
		$('#msgwindow').append('<li class="log">' + msg);
	});

	socket.on('tweet', function(tweet){
    var lat, lon;
		if (tweet.geo && tweet.geo.coordinates) {
      lat = tweet.geo.coordinates[0];
      lon = tweet.geo.coordinates[1];
		}
		else if (tweet.place) {
			var bb = tweet.place.bounding_box.coordinates;
      lat = bb[0][0][1];
      lon = bb[0][1][0];
		}
		else {
			console.log("no location data");
    }
		//$('#msgwindow').append('<li class="tweet">' + tweet.user.name + " (@" + tweet.user.screen_name + '): ' + tweet.text + ' | ' + tweet.geo.coordinates[0] + ', ' + tweet.geo.coordinates[1]);
		if (lat) {
      $scope.mapTweet(lat, lon, tweet.text);
			$('#messages').append($('<li>').text(tweet.text));
			$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
		}
	});

	socket.on('chat message', function(msg) {
		$('#messages').append($('<li>').text(msg));
		$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
	});

	$scope.mapTweet = function(lat, lng, msg) {
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
	        // coordinates: [-73.98, 40.723]
	        coordinates: [lng, lat]
	    },
	    properties: {
	        title: 'Peregrine Espresso',
	        description: msg,
	        // one can customize markers by adding simplestyle properties
	        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
	        'marker-size': 'large',
	        'marker-color': '#BE9A6B',
	        'marker-symbol': 'cafe'
	    }
		}).addTo(map);
	}
}]);

