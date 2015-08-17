//HypeCompassService

(function() {
	'use strict';

	var HypeCompassService = function($rootScope) {
		var hypeCompassAngle;
		hypeCompassAngle = 0;

		return {
			getAngle: function() {
				return hypeCompassAngle;
			},
			setAngle: function(angle) {
				hypeCompassAngle = hypeCompassAngle % 360;
			},
			rotateClockwise: function(angle) {
				$rootScope.angle = (hypeCompassAngle + angle) % 360;
			}
		};
	};

	HypeCompassService.$inject = ['$rootScope'];
	angular.module('HypApp', []).factory('HypeCompassService', HypeCompassService);
}();