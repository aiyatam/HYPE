var path = require('path');
var Twit = require('twit');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server_port = 3000;
var server_ip_address = '0.0.0.0';

app.use(express.static(path.join(__dirname, 'Angular')));

var T = new Twit({
  consumer_key: '***REMOVED***',
  consumer_secret: '***REMOVED***',
  access_token: '***REMOVED***',
  access_token_secret: '***REMOVED***'
});

var twitStream = T.stream('statuses/filter', { locations : [ '-74', '40', '-73', '41' ] });

function startClientStream() {
  io.on('connection', function(socket) {
    socket.emit('log', 'Connection established.');
  });

  console.log('Stream to clients ready.');
}
startClientStream();

twitStream.on('tweet', function (tweet) {
  io.emit('tweet', tweet);
});

http.listen(server_port, server_ip_address, function() {
  console.log('HYPE.map is online.');
});
