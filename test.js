var podcastFeed = require("./podcast-feed.js");

podcastFeed.parse("http://www.hellointernet.fm/podcast?format=rss", function(podcast) {
  console.log(podcast.title + "=" + podcast.episodes.length);
});


podcastFeed.parse("https://www.relay.fm/cortex/feed", function(podcast) {
  console.log(podcast.title + "=" + podcast.episodes.length);
});

podcastFeed.parse("http://feeds.gimletmedia.com/hearstartup", function(podcast) {
  console.log(podcast.title + "=" + podcast.episodes.length);
});
