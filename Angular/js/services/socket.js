(function() {
	'use strict';
	console.log('socket code hit!');
	var SocketService = function($rootScope) {
		var socket = io();
		console.log('socket created');

		return {
			on: function(eventName, callback) {
				if (callback) {
					socket.on(eventName, function() {
					var args = arguments;
						$rootScope.$apply(function() {
							callback.apply(socket, args);
						});
					});
				}
			},
			emit: function(eventName, data, callback) {
				if (callback) {
					socket.emit(eventName, data, function() {
						var args = arguments;
						$rootScope.$apply(function() {
							callback.apply(socket, args);
						});
					});
				}
			}
		};
	};

	SocketService.$inject = ['$rootScope'];
	angular.module('Socket', []).factory('SocketService', SocketService);
})();