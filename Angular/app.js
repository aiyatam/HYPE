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

	// SOCKET FUNCTIONS
	var socket = io();

  socket.on('connect', function() {
    updateUserCoordinates(map);
  });
	socket.on('log', function(msg) {
		$('#msgwindow').append('<li class="log">' + msg);
	});

	socket.on('tweet', function(tweet){
		$scope.mapTweet(tweet.latitude, tweet.longitude, tweet.text_no_links, tweet.user.screen_name);
		$('#messages').append($('<li>').html(
			'<a href="https://twitter.com/' + tweet.user.screen_name + '" target="_blank">' + 
			'<b class="tweeter">@' + tweet.user.screen_name + '</b></a>: ' + 
			tweet.text_no_links)); // TODO add image from tweet.links
		$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);
	});

	$scope.mapTweet = function(lat, lon, msg, usr) {
		//console.log('Mapping (lat, lon): (' + lat + ', ' + lon + ')');

		if (!lat || !lon) {
			return;
		}

		L.mapbox.featureLayer({
	    type: 'Feature',
	    geometry: {
	        type: 'Point',
	        coordinates: [lon, lat]
	    },
	    properties: {
	        description: '<b>@' + usr + '</b>' + ': ' + msg,
	        // one can customize markers by adding simplestyle properties
	        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
	        'marker-symbol': 'mobilephone',
	        'marker-size': 'small',
	        'marker-color': '#ec008c'
	    }
		}).addTo(map);
	}
}]);

function updateUserCoordinates(map) {
  // Get user coordinates
  var gl = navigator.geolocation;
  if (gl){
    gl.getCurrentPosition(function (position) {
      console.log('user geolocation shared');
      var lat = position.coords.latitude,
          lon = position.coords.longitude;

      // Send coords to server    
      postUserCoordinates(lat, lon);

      // Update map view
      map.setView([lat, lon], 13);
      L.mapbox.featureLayer({
        type: 'Feature',
        geometry: {
            type: 'Point',
            // coordinates here are in longitude, latitude order because
            // x, y is the standard for GeoJSON and many formats
            // coordinates: [-73.98, 40.723]
            coordinates: [lon, lat]
        },
        properties: {
            'marker-symbol': 'marker-stroked',
            'marker-size': 'small',
            'marker-color': '#00aeef'
        }
      }).addTo(map);
    });
  }
}

function postUserCoordinates(lat, lon) {
  console.log("Posting user coordinates");
  var http = new XMLHttpRequest();
  http.open("POST", "/coordinates", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.send("lat="+lat+"&lon="+lon);
}
