'use strict';

var _ = require('lodash');
var util = require('./util');

function stream(twitStream, io) {

  function onTweet(tweet) {
    var text = tweet.text;

    // ignore direct tweets
    if (util.startsWith(text, '@')) {
      return;
    }
    var latLon = util.getCoordinatesFromTweet(tweet);
    if (!latLon.lat || util.tooFarAway(latLon.lat, latLon.lon)) {
      return;
    }

    tweet.latitude = latLon.lat;
    tweet.longitude = latLon.lon;

   // parse tweets & remove links
    var wordlist = text.split(' ');

    var links = _.filter(wordlist, function(word) {
      return util.startsWith(word, 'http');
    });

    var words = _.map(_.difference(wordlist, links), function(word) {
      if (word.length > 1 && util.startsWith(word, '@')) {
        return util.createHandleTag(word);
      }
      if (util.startsWith(word, '#')) {
        return util.createHashTag(word);
      }
      return word;
    });

    tweet.text_no_links = words.join(' ');
    tweet.links = _.map(links, function(link) {
      return util.getLinkTag(link.trim(), link.trim());
    });
    if (tweet.text_no_links.length > 0) {
      io.emit('tweet', tweet);
    }
  }

  twitStream.on('tweet', onTweet);
  twitStream.on('error', function (err) {
    console.log(err.code + ': ' + err.message);
  });
  twitStream.on('connect', function (req) {
    console.log('Twitter stream connecting... ' + req);
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
}

module.exports = {
  stream: stream
};
