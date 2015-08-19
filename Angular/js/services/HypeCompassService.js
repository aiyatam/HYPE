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
				hypeCompassAngle = angle % 360;
				$('#hypecompass').css({
					'-webkit-transform' : 'rotate('+ hypeCompassAngle +'deg)',
					'-moz-transform' : 'rotate('+ hypeCompassAngle +'deg)',
	                '-ms-transform' : 'rotate('+ hypeCompassAngle +'deg)',
	                'transform' : 'rotate('+ hypeCompassAngle +'deg)'
	            });
			},
			rotateClockwise: function(angle) {
				hypeCompassAngle = (hypeCompassAngle + angle) % 360;
				$('#hypecompass').css({
					'-webkit-transform' : 'rotate('+ hypeCompassAngle +'deg)',
					'-moz-transform' : 'rotate('+ hypeCompassAngle +'deg)',
	                '-ms-transform' : 'rotate('+ hypeCompassAngle +'deg)',
	                'transform' : 'rotate('+ hypeCompassAngle +'deg)'
	            });
			}
		};
	};

	HypeCompassService.$inject = ['$rootScope'];
	angular.module('HypeCompass', []).factory('HypeCompassService', HypeCompassService);
})();