(function() {
	'use strict';

	var SocketService = function($rootScope) {
		var socket = io();
		console.log('socket created');

		return {
			on: function(eventName, callback) {

			}
		};

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

	SocketService.$inject = ['$rootScope'];
	angular.module('socketService', []).factory('Socket', SocketService);

})();