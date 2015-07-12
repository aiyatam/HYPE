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

  // Get user coordinates
  var gl = navigator.geolocation;
  if (gl){
    gl.getCurrentPosition(function (position) {
      var lat = position.coords.latitude,
          lon = position.coords.longitude;
      map.setView([lat, lon], 13);
      postUserCoordinates(lat, lon);
    });
  }

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
    var coords = getCoordinatesFromTweet(tweet);
    var lat = coords[0],
        lon = coords[1];

		if (lat) {
      // XXX access tweet.text, tweet.tweet_no_links, and tweet.link
			$scope.mapTweet(lat, lon, tweet.text_no_links, tweet.user.screen_name);
			$('#messages').append($('<li>').html(tweet.text_no_links + '')); // TODO add image from tweet.links
			$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
		}
	});

	// socket.on('chat message', function(msg) {
	// 	$('#messages').append($('<li>').text(msg));
	// 	$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
	// });

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
	        'marker-symbol': 'mobilephone',
	        'marker-size': 'small',
	        'marker-color': '#ec008c',
	    }
		}).addTo(map);
	}
}]);

function getCoordinatesFromTweet(tweet) {
  var lat, lon;
  if (tweet.geo && tweet.geo.coordinates) {
    lat = tweet.geo.coordinates[0];
    lon = tweet.geo.coordinates[1];
  }
  else if (tweet.place) {
    var bb = tweet.place.bounding_box.coordinates[0];
    lat = bb[0][1];
    lon = bb[1][0];
  }
  return [lat, lon];
}
function postUserCoordinates(lat, lon) {
  var http = new XMLHttpRequest();
  http.open("POST", "/coordinates", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.send("lat="+lat+"&lon="+lon);
}

