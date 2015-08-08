'use strict';

var app = require('./lib/express');
var Twit = require('twit');
var streamHandler = require('./lib/stream_handler');
var util = require('./lib/util');

var secrets = require('./secrets');

var port = process.env.PORT || 3000;
var host = '0.0.0.0';

var path = 'statuses/filter';

var server = app.listen(port, host, function() {
  console.log('server listening over UNSECURED HTTP at port ' + port);
});
var io = require('socket.io').listen(server);

var T = new Twit({
  consumer_key: process.env.TCKEY || secrets.two.key,
  consumer_secret: process.env.TCSECRET || secrets.two.secret,
  access_token: process.env.TATOKEN || secrets.two.token,
  access_token_secret: process.env.TATSECRET || secrets.two.token_secret
});

app.post('/api/location/coordinates', function(req, res) {
  console.log('Setting coordinates');
  var lat = req.body.lat;
  var lon = req.body.lon;
  if (lat && lon) {
    console.log('Starting stream based on user coordinates...');
    var USER_LAT = parseFloat(lat);
    var USER_LON = parseFloat(lon);
    util.setLatLon(parseFloat(lat), parseFloat(lon));
    var stream = T.stream(path,
      {locations: [USER_LON - 0.02, USER_LAT - 0.02,
        USER_LON + 0.02, USER_LAT + 0.02]});
    streamHandler.stream(stream, io);
  }
});
