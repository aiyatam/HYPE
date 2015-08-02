'use strict'

var hypeMap = angular.module('hypeMap', []);

$(document).ready(function() {
	// Pause scrolling
	$('#chat-scroll').scroll(function() {
		console.log('scrolling');
	});
});

//Add rotation function to JQuery
jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
};
var rotation = 0;

// Public Functions
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
}

function postUserCoordinates(lat, lon) {
  console.log("Posting user coordinates");
  var http = new XMLHttpRequest();
  http.open("POST", "/coordinates", true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.send("lat="+lat+"&lon="+lon);
}
