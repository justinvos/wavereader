var http = require("http-request");
var timeConversion = require("./time-conversion.js");
var xml2js = require("xml2js");

function parseTitle(data) {
  return data.rss.channel[0].title[0];
}

function parseDate(data) {
  if(data.rss.channel[0].pubDate != undefined) {
    return timeConversion.convertToStandardTime(data.rss.channel[0].pubDate[0]);
  } else if(data.rss.channel[0].lastBuildDate != undefined) {
    return timeConversion.convertToStandardTime(data.rss.channel[0].lastBuildDate[0]);
  } else {
    return parseEpisodeDate(data.rss.channel[0].item[0]);
  }
  console.log(data.rss.channel[0]);
}

function parseDescription(data) {
  return data.rss.channel[0].description[0];
}

function parseImage(data) {
  return data.rss.channel[0]["itunes:image"][0]["$"]["href"];
}

function parseEpisodeTitle(item) {
  return item.title;
}

function parseEpisodeDate(item) {
  return timeConversion.convertToStandardTime(item.pubDate[0]);
}

function parseEpisodeDescription(item) {
  return item.description;
}

function parseEpisodeImage(item) {
  if(item["itunes:image"] != undefined) {
    return item["itunes:image"][0]["$"]["href"];
  } else if(item["media:content"] != undefined && item["media:content"][0]["$"]["type"].startsWith("image")) {
    return item["media:content"][0]["$"]["url"];
  }
}

function parseEpisodeAudio(item) {
  if(item["enclosure"] != undefined && item["enclosure"][0]["$"]["type"].startsWith("audio")) {
    return item["enclosure"][0]["$"]["url"];
  }
}

function parseEpisode(item, index, podcast) {
  var episode = new Episode(podcast, index);

  episode.title = parseEpisodeTitle(item);
  episode.date = parseEpisodeDate(item);
  episode.description = parseEpisodeDescription(item);
  episode.image = parseEpisodeImage(item);
  episode.audio = parseEpisodeAudio(item);

  podcast.episodes.push(episode);
}

function parseEpisodes(data, podcast) {
  podcast.episodes = [];

  var items = data.rss.channel[0].item;
  for(var index = 0; index < items.length; index++) {
    parseEpisode(items[index], index, podcast);
  }
}

parseBody = function(url, body, callback) {
  xml2js.parseString(body, function(err, res) {
    if(err) {
      console.log(err);
    } else {
      podcast = new Podcast(url);
      podcast.title = parseTitle(res);
      podcast.date = parseDate(res);
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


exports.parse = parse;
exports.parseBody = parseBody;
