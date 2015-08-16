/**
 * HTTP Interceptor Service
 */

(function() {
	'use strict';
	
	var HttpInterceptorService = function($rootScope, $q, $window) {
		return {
			request: function(config) {
				config.headers = config.headers || {};
				return config;
			},
			response: function(response) {
				return response || $q.when(response);
			}
		};
	};
	
	HttpInterceptorService.$inject = ['$rootScope', '$q', '$window'];
	angular.module('Http', []).factory('HttpInterceptorService', HttpInterceptorService);
})();