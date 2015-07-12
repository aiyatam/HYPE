var path = require('path');
var Twit = require('twit');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var server_port = 3000;
var server_ip_address = '0.0.0.0';
// var passport = require('passport');
// var InstagramStrategy = require('passport-instagram').Strategy;
// var request = require('request');

app.use(express.static(path.join(__dirname, 'Angular')));


/* TWIT */

var secrets = {
  one : {
    key : '***REMOVED***',
    secret : '***REMOVED***',
    token : '***REMOVED***',
    token_secret : '***REMOVED***'
  },
  two : {
    key : '***REMOVED***',
    secret : '***REMOVED***',
    token : '***REMOVED***',
    token_secret : '***REMOVED***'

  }
}
var T = new Twit({
  consumer_key: secrets.two.key,
  consumer_secret: secrets.two.secret,
  access_token: secrets.two.token,
  access_token_secret: secrets.two.token_secret
});

// southwest corner, northeast corner
var twitStream = T.stream('statuses/filter', { locations : [ '-74.04', '40.7', '-74', '40.88' ] });

function startClientStream() {
  io.on('connection', function(socket) {
    socket.emit('log', 'Connection established.');
    console.log('Connection established with client.');
  });

  console.log('Stream to clients ready.');
}
startClientStream();

twitStream.on('tweet', function (tweet) {
  var text = tweet.text;
  var text_no_links = text;
  var link = null;
  if (text.indexOf("http") != -1) {
    var i = text.indexOf("http");
    text_no_links = text.substring(0, i).trim();
    link = text.substring(i).trim();
  }

  tweet.text_no_links = text_no_links;
  tweet.link = link;

  io.emit('tweet', tweet);
});

/* GRAM */

// app.get('/insta', function(req, res) {
//   request('https://api.instagram.com/v1/media/search?lat=40.7127&lng=74.0059&access_token=607641620.41012ab.297b3487f1e04b82bd440c3666230fae', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var info = JSON.parse(body);
//       res.send(info);
//     }
//   });
// });

http.listen(server_port, server_ip_address, function() {
  console.log('HYPE.map is online.');
});
