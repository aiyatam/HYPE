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
	var map = L.mapbox.map('map', 'mapbox.comic').setView([40.723, -73.98], 13);

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
			$scope.mapTweet(lat, lon, tweet.text, tweet.user.screen_name);
			$('#messages').append($('<li>').text(tweet.text));
			$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
		}
	});

	socket.on('chat message', function(msg) {
		$('#messages').append($('<li>').text(msg));
		$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
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
	        description: '<b>@' + usr + '</b>' + ': ' + msg,
	        // one can customize markers by adding simplestyle properties
	        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
	        'marker-symbol': 'star',
	        'marker-size': 'small',
	        'marker-color': '#ec008c',
	    }
		}).addTo(map);
	}
}]);

