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
var T = new Twit({
  consumer_key: secrets.two.key,
  consumer_secret: secrets.two.secret,
  access_token: secrets.two.token,
  access_token_secret: secrets.two.token_secret
});

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
  var split = getSplitKeyword(handle);
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