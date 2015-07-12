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
  consumer_key: process.env.TCKEY || secrets.one.key,
  consumer_secret: process.env.TCSECRET || secrets.one.secret,
  access_token: process.env.TATOKEN || secrets.one.token,
  access_token_secret: process.env.TATSECRET || secrets.one.token_secret
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

function onTweet(tweet) {
  var text = tweet.text;

  // ignore direct tweets
  if (startsWith(text, "@")) {
    return;
  }

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

  if (tweet.text_no_links.trim().length > 0) {
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
    twitStream = T.stream('statuses/filter', {
      locations : [ parseFloat(lon)-0.1, parseFloat(lat)-0.1, parseFloat(lon)+0.1, parseFloat(lat)+0.1 ]
    });
    twitStream.on('tweet', onTweet);
  }
});

http.listen(server_port, server_ip_address, function() {
  console.log('HYPE.map is online.');
});