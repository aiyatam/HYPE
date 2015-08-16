(function() {
	'use strict';
	
	angular.module('HypeApp', ['HypeMap', 'Socket', 'Http']);

	angular.module('HypeApp').config(function($httpProvider) {
		$httpProvider.interceptors.push('HttpInterceptorService');
	});

})();