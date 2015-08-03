'use strict'

$(document).ready(function() {
	//Add rotation function to JQuery
	jQuery.fn.rotate = function(degrees) {
	    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
	                 '-moz-transform' : 'rotate('+ degrees +'deg)',
	                 '-ms-transform' : 'rotate('+ degrees +'deg)',
	                 'transform' : 'rotate('+ degrees +'deg)'});
	};
});