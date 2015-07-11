'use strict'

var hypeMap = angular.module('hypeMap', []);
console.log("test");

// SERVICES
hypeMap.service('hypeMapService', function() {
	console.log("testService");
	//TODO return dummy data (JSON)
});

// CONTROLLERS
hypeMap.controller('hypeMapController', ['$scope', 'hypeMapService', function($scope) {

	// Google Map
	/*function initialize() {
		var mapCanvas = document.getElementById('map-canvas');
		var mapOptions = {
		  center: new google.maps.LatLng(40.7127, -74.0059),
		  zoom: 8,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(mapCanvas, mapOptions)
	}
	google.maps.event.addDomListener(window, 'load', initialize);*/

	// CartoDB Stuff
	/*var map;
	function init(){
		// initiate leaflet map
		map = new L.Map('cartodb-map', { 
			center: [40,-98],
			zoom: 4
		})

		L.tileLayer('https://dnv9my2eseobd.cloudfront.net/v3/cartodb.map-4xtxp73f/{z}/{x}/{y}.png', {
			attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>'
		}).addTo(map);

		var layerUrl = 'http://documentation.cartodb.com/api/v2/viz/236085de-ea08-11e2-958c-5404a6a683d5/viz.json';

		// change the query for the first layer
		var subLayerOptions = {
			sql: "SELECT * FROM example_cartodbjs_1 where adm0_a3 = 'USA'",
			cartocss: "#example_cartodbjs_1{marker-fill: #109DCD; marker-width: 5; marker-line-color: white; marker-line-width: 0;}"
		}

		cartodb.createLayer(map, layerUrl)
			.addTo(map)
			.on('done', function(layer) {
		  		layer.getSubLayer(0).set(subLayerOptions);
			}).on('error', function() {
		  	//log the error
		});
	} */ 

	// MAP BOX ISH
	mapboxgl.accessToken = 'pk.eyJ1IjoiYW5nZWxoYWNrc3F1YWQiLCJhIjoiZDAwYmMwMTcwMzQ0NTdiMmUzMGJmNWZjNmFmOTI2OGYifQ.ifIhIKtHhbExiHiCXqFoIw';
	var map = new mapboxgl.Map({
		container: 'map', // container id
		style: 'https://www.mapbox.com/mapbox-gl-styles/styles/outdoors-v7.json', //stylesheet location
		center: [40.7127, -74.0059], // starting position
		zoom: 12 // starting zoom
	});

	//Initial Value
	$scope.data = {};

	//Functions
	$scope.mapTweets = function() {
		console.log("Map all the tweets!!");
	}
}]);

