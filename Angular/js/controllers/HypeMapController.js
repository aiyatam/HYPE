(function() {
	'use strict';

	// Define HypeMapController Function
	var HypeMapController = function($scope, $http) {
		
		// PUBLIC METHODS ==========================================================
		$scope.mapTweet = function(lat, lon, msg, usr, isHYPE) {
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
			        'marker-color': '#ed1c24'
			    }
			}).addTo(map);
		};

		// PRIVATE METHODS =========================================================
		var updateUserCoordinates = function(map) {
			// Get user coordinates
			var gl = navigator.geolocation;
			if (gl) {
				gl.getCurrentPosition(function (position) {
					console.log('user geolocation shared');
					var lat = position.coords.latitude;
					var lon = position.coords.longitude;

					// Send coords to server    
					postUserCoordinates(lat, lon);

					// Update map view
					map.setView([lat, lon], 14);
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
		};

		var postUserCoordinates = function(lat, lon) {
			console.log("Posting user coordinates: " + lat + ", " + lon);
			$http.post("/api/location/coordinates", {
				"lat": lat,
				"lon": lon
			}); 
		};

		// HYPE COMPASS STUFF ======================================================
		L.mapbox.accessToken = 'pk.eyJ1IjoiYW5nZWxoYWNrc3F1YWQiLCJhIjoiZDAwYmMwMTcwMzQ0NTdiMmUzMGJmNWZjNmFmOTI2OGYifQ.ifIhIKtHhbExiHiCXqFoIw';
		var map = L.mapbox.map('map', 'angelhacksquad.23ef5ec3').setView([40.723, -73.98], 14);

		$scope.rotation = 0;
		
		map.legendControl.addLegend('Hype Compass');
		$('.map-legends.wax-legends').prepend('<img id="hypecompass" src="images/hypecompass.png" height="100" width="100"/>');
		$('#hypecompass').click(function() {
		    $scope.rotation += 5;
		    $(this).rotate($scope.rotation);
		});

		setInterval(function() {
			$scope.rotation += Math.random() * 360;
			$('#hypecompass').rotate($scope.rotation);
		}, 100);

		// SOCKET FUNCTIONS ======================================================== (move this elsewhere)
		var socket = io();

		socket.on('connect', function() {
			updateUserCoordinates(map);
		});

		socket.on('log', function(msg) {
			$('#msgwindow').append('<li class="log">' + msg);
		});

		socket.on('tweet', function(tweet) {
			var isHYPE = tweet.user.followers_count > 5000;
			if (isHYPE) {
				console.log("HYPE TWEET FROM " + tweet.user.screen_name);
			}
			
			$scope.mapTweet(tweet.latitude, tweet.longitude, tweet.text_no_links, tweet.user.screen_name, isHYPE);

			var hypeClass = isHYPE ? "hypeTweet" : "";
			var htmlString = '<a href="https://twitter.com/' + tweet.user.screen_name + '" target="_blank">' + 
							 '<b class="tweeter">@' + tweet.user.screen_name + '</b></a>: ' + 
							 tweet.text_no_links;
			
			if (tweet.entities.media) {
				htmlString = '<div class="img-wrap"><img src="' + tweet.entities.media[0].media_url + '" height="80px"></div><div class="descr">' + htmlString + '</div>';
			}

			$('#messages').append($('<li class="' + hypeClass + '"">').html(htmlString)); // TODO add image from tweet.links
			$('#chat-scroll').scrollTop($('#chat-scroll')[0].scrollHeight);

			//Rotate Hype Compass
			$scope.rotation += 10;
			$('#hypecompass').rotate($scope.rotation);
		});
	};

	HypeMapController.$inject = ['$scope', '$http'];
	angular.module('HypeMap', []).controller('HypeMapController', HypeMapController);

})();
