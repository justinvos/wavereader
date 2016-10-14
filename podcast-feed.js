var http = require('http-request');
var xml2js = require('xml2js');

function parseTitle(data) {
  return data.rss.channel[0].title[0];
}

function parseDescription(data) {
  return data.rss.channel[0].description[0];
}

function parseImage(data) {
  return data.rss.channel[0]["itunes:image"][0]["$"]["href"];
}

function parseEpisode(item, index, podcast) {
  var episode = new Episode(podcast, index);

  episode.title = item.title;
  episode.description = item.description;

  if(item["itunes:image"] != undefined) {
    episode.image = item["itunes:image"][0]["$"]["href"];
  } else if(item["media:content"] != undefined && item["media:content"][0]["$"]["type"].startsWith("image")) {
    episode.image = item["media:content"][0]["$"]["url"];
  }


  if(item["enclosure"] != undefined && item["enclosure"][0]["$"]["type"].startsWith("audio")) {
    episode.audio = item["enclosure"][0]["$"]["url"];
  }

  podcast.episodes.push(episode);
}

function parseEpisodes(data, podcast) {
  podcast.episodes = [];

  var items = data.rss.channel[0].item;
  for(var index = 0; index < items.length; index++) {
    parseEpisode(items[index], index, podcast);
  }
}


download = function(url, callback) {

};

parseBody = function(url, body, callback) {
  xml2js.parseString(body, function(err, res) {
    if(err) {
      console.log(err);
    } else {
      podcast = new Podcast(url);
      podcast.title = parseTitle(res);
      podcast.description = parseDescription(res);
      podcast.image = parseImage(res);
      parseEpisodes(res, podcast);

      callback(podcast);
    }
  });
};

parse = function(url, callback) {
  http.get(url, function(err, res) {
    if(err) {
      console.log(err);
      callback();
    } else {
      parseBody(url, res.buffer.toString(), callback);
    }
  });
};


var Episode = function(podcast, index) {
  this.index = index;
  this.title = "";
  this.description = "";
  this.image = podcast.image;
  this.audio = "";
}

var Podcast = function(url) {
  this.url = url;
  this.title = "";
  this.description = "";
  this.image = "";
  this.episodes = [];
}


exports.download = download;
exports.parse = parse;
