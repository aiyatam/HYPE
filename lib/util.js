'use strict';

var USER_LAT, USER_LON;

function setLatLon(lat, lon) {
  USER_LAT = lat;
  USER_LON = lon;
}
function startsWith(word, pre) {
  return word.indexOf(pre) === 0;
}

function getLinkTag(link, text) {
  return "<a href=\"" + link + "\" target=\"_blank\">" + text + "</a>";
}

function createHandleTag(handle) {
  var link = "http://twitter.com/" + handle.substring(1);
  return getLinkTag(link, handle);
}

function createHashTag(hash) {
  var link = "http://twitter.com/hashtag/" + hash.substring(1);
  return getLinkTag(link, hash);
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

module.exports = {
  startsWith: startsWith,
  getCoordinatesFromTweet: getCoordinatesFromTweet,
  getLinkTag: getLinkTag,
  tooFarAway: tooFarAway,
  createHandleTag: createHandleTag,
  createHashTag: createHashTag,
  setLatLon: setLatLon
};
