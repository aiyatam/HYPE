var path = require('path');
var Twit = require('twit');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var server_port = process.env.PORT || 3000;
var server_ip_address = '0.0.0.0';
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'Angular')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var USER_LAT, USER_LON;

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

function startsWith(word, pre) {
  return word.indexOf(pre) == 0;
}

function createHandleTag(handle) {
  var link = "http://twitter.com/" + handle.substring(1);
  return getLinkTag(link, handle);
}

function createHashTag(hash) {
  var link = "http://twitter.com/hashtag/" + hash.substring(1);
  return getLinkTag(link, hash);
}

function getLinkTag(link, text) {
  return "<a href=\"" + link + "\" target=\"_blank\">" + text + "</a>";
}

function getCoordinatesFromTweet(tweet) {
  var lat, lon;
  if (tweet.geo && tweet.geo.coordinates) {
    lat = tweet.geo.coordinates[0];
    lon = tweet.geo.coordinates[1];
  }
  else if (tweet.place) {
    var bb = tweet.place.bounding_box.coordinates[0];
    lat = bb[0][1];
    lon = bb[1][0];
  }
  return [lat, lon];
}

function distance(lat1, lon1, lat2, lon2) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var radlon1 = Math.PI * lon1/180
  var radlon2 = Math.PI * lon2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  return dist * 1.609344;
}

function tooFarAway(lat, lon) {
  if (USER_LAT)
    return distance(lat, lon, USER_LAT, USER_LON) > 12;
  return false;
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function onTweet(tweet) {
  var text = tweet.text;
  
  // ignore direct tweets
  if (startsWith(text, "@")) {
    return;
  }
  var latLon = getCoordinatesFromTweet(tweet);
  if (!latLon[0] || tooFarAway(latLon[0], latLon[1])) {
    return;
  }

  tweet.latitude = latLon[0];
  tweet.longitude = latLon[1];

 // parse tweets & remove links
  var wordlist = text.split(" ");
  var formattedWords = [];
  var linkList = [];

  for (var w in wordlist) {
    var word = wordlist[w];
    if (word.length > 1 && startsWith(word, "@")) {
      formattedWords.push(createHandleTag(word));
    }
    else if (startsWith(word, "#")) {
      formattedWords.push(createHashTag(word));
    }
    else if (startsWith(word, "http")) {
      var l = word.trim();
      linkList.push(getLinkTag(l,l));
    }
    else {
      formattedWords.push(word);
    }
  }

  tweet.text_no_links = formattedWords.join(" ");
  tweet.links = linkList;
  if (tweet.text_no_links.length > 0) {
    io.emit('tweet', tweet);
  }
}

var twitStream = T.stream('statuses/filter', { locations : [ '-74.04', '40.7', '-74', '40.88' ] });
twitStream.on('tweet', onTweet);
twitStream.on('error', function (err) {
  console.log(err.code + ': ' + err.message);
});
twitStream.on('connect', function (req) {
  console.log('Twitter stream connecting... ' + req)
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
  var lat = req.body.lat,
      lon = req.body.lon;
  if (lat && lon) {
    twitStream.stop();
    console.log("Starting stream based on user coordinates");
    USER_LAT = parseFloat(lat);
    USER_LON = parseFloat(lon);
    twitStream = T.stream('statuses/filter', {
      locations : [ USER_LON-0.02, USER_LAT-0.02, USER_LON+0.02, USER_LAT+0.02 ]
    });
    twitStream.on('tweet', onTweet);
  }
});

http.listen(server_port, server_ip_address, function() {
  console.log('HYPE.map is online.');
});