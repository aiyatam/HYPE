'use strict';

var path = require('path');
var Twit = require('twit');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var server_port = process.env.PORT || 3000;
var server_ip_address = '0.0.0.0';
var bodyParser = require('body-parser');

var util = require('./lib/util');

app.use(express.static(path.join(__dirname, 'Angular')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var secrets = require('./secrets.js');
// streams are limited to one client per credentials
// so use environment variables in deployment if available
var twitterCreds = {
  consumer_key: process.env.TCKEY || secrets.two.key,
  consumer_secret: process.env.TCSECRET || secrets.two.secret,
  access_token: process.env.TATOKEN || secrets.two.token,
  access_token_secret: process.env.TATSECRET || secrets.two.token_secret
};
var T = new Twit(twitterCreds);

function startClientStream() {
  io.on('connection', function(socket) {
    socket.emit('log', 'Connection established.');
    console.log('Connection established with client.');
  });

  console.log('Stream to clients ready.');
}
startClientStream();

function onTweet(tweet) {
  var text = tweet.text;

  // ignore direct tweets
  if (util.startsWith(text, '@')) {
    return;
  }
  var latLon = util.getCoordinatesFromTweet(tweet);
  if (!latLon[0] || util.tooFarAway(latLon[0], latLon[1])) {
    return;
  }

  tweet.latitude = latLon[0];
  tweet.longitude = latLon[1];

 // parse tweets & remove links
  var wordlist = text.split(' ');
  var formattedWords = [];
  var linkList = [];

  for (var w in wordlist) {
    var word = wordlist[w];
    if (word.length > 1 && util.startsWith(word, '@')) {
      formattedWords.push(util.createHandleTag(word));
    } else if (util.startsWith(word, '#')) {
      formattedWords.push(util.createHashTag(word));
    } else if (util.startsWith(word, 'http')) {
      var l = word.trim();
      linkList.push(util.getLinkTag(l, l));
    } else {
      formattedWords.push(word);
    }
  }

  tweet.text_no_links = formattedWords.join(' ');
  tweet.links = linkList;
  if (tweet.text_no_links.length > 0) {
    io.emit('tweet', tweet);
  }
}

var twitStream = T.stream('statuses/filter', { locations: [ '-74.04', '40.7', '-74', '40.88' ] });
twitStream.on('tweet', onTweet);
twitStream.on('error', function (err) {
  console.log(err.code + ': ' + err.message);
});
twitStream.on('connect', function (req) {
  console.log('Twitter stream connecting... ' + req);
  console.log('Using credentials: ' + twitterCreds.access_token);
});
twitStream.on('connected', function (resp) {
  console.log('Twitter stream connected. ' + resp);
});
twitStream.on('disconnect', function (msg) {
  console.log('Twitter stream disconnected. ' + msg);
});
twitStream.on('reconnect', function (req, resp, intv) {
  console.log('Attempting reconnection to twitter stream.' +
              ' | Req: ' + req + ' | Resp: ' + resp +
              ' | Intv: ' + intv);
});

// Get user location
app.post('/coordinates', function(req, res) {
  var lat = req.body.lat;
  var lon = req.body.lon;
  if (lat && lon) {
    twitStream.stop();
    console.log('Starting stream based on user coordinates');
    var USER_LAT = parseFloat(lat);
    var USER_LON = parseFloat(lon);
    util.setLatLon(parseFloat(lat), parseFloat(lon));
    twitStream = T.stream('statuses/filter', {
      locations: [ USER_LON - 0.02, USER_LAT - 0.02, USER_LON + 0.02, USER_LAT + 0.02 ]
    });
    twitStream.on('tweet', onTweet);
  }
});

http.listen(server_port, server_ip_address, function() {
  console.log('HYPE.map is online.');
});
