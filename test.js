var podcastFeed = require("./podcast-feed.js");

podcastFeed.download("http://www.hellointernet.fm/podcast?format=rss", function(url, res) {
  podcastFeed.parse(url, res, function(podcast) {
    console.log(podcast.getTitle());
  });
});
