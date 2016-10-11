var http = require('http-request');
var xml2js = require('xml2js');

function parseTitle(data) {
  return data.rss.channel[0].title[0];
}

download = function(url, callback) {
  console.log("Downloading");
  http.get(url, function(err, res) {
    if(err) {
      console.log(err);
    } else {
      callback(url, res.buffer.toString());
    }
  });
};

parse = function(url, body, callback) {
  console.log("Parsing");
  console.log(body.length);
  xml2js.parseString(body, function(err, res) {
    if(err) {
      console.log(err);
    } else {
      podcast = new PodcastFeed(url);
      podcast.setTitle(parseTitle(res));

      callback(podcast);
    }
  });
};


var PodcastFeed = function(url) {
  this.url = url

  PodcastFeed.prototype.getTitle = function() {
    return this.title;
  }

  PodcastFeed.prototype.setTitle = function(title) {
    this.title = title;
  }
}


exports.download = download;
exports.parse = parse;
