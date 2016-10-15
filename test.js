var podcastFeed = require("./podcast-feed.js");

function test(url) {
  podcastFeed.parse(url, function(podcast) {
    console.log("Title : " + podcast.title);
    console.log("URL   : " + podcast.url);
    console.log("Date  : " + podcast.date);
    console.log("Desc. : " + podcast.description);
    console.log("Image : " + podcast.image);
    console.log("# Ep. : " + podcast.episodes.length)
    console.log();
  });
}

testCases = [
  "http://www.hellointernet.fm/podcast?format=rss",
  "https://www.relay.fm/cortex/feed",
  "http://feeds.gimletmedia.com/hearstartup",
  "https://simplecast.com/podcasts/1515/rss",
  "http://www.npr.org/rss/podcast.php?id=510289",
  "http://feeds.99percentinvisible.org/99percentinvisible",
  "http://feeds.soundcloud.com/users/soundcloud:users:156542883/sounds.rss"
];

for(testCase of testCases) {
  test(testCase);
}
