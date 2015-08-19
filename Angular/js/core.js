(function() {
	'use strict';
	
	angular.module('HypeApp', ['HypeMap', 'Socket', 'Http', 'HypeCompass']);

	angular.module('HypeApp').config(function($httpProvider) {
		$httpProvider.interceptors.push('HttpInterceptorService');
	});

})();