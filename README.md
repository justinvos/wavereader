# podcast-feed

**podcast-feed** is a really simple and straightforward podcast feed reader. Just install using the `npm install podcast-feed` command and require it within your Node project. To get started using **podcast-feed**, all you need is the following code snippet.

```
var podcastFeed = require("podcast-feed");

podcastFeed.parse(url, function(podcast) {
	// calls back with a Podcast object
});

```

### Podcast object
The podcast object contains six members; **url**, **title**, **date**, **description**, **image** and **episodes**.

`podcast.url` is the URL of the podcast feed (*string*). This is the URL given to the parse function.

`podcast.title` is the name of the podcast (*string*).

`podcast.date` is the date of this version of the feed being published, formatted in the form of ISO 8601 (*string*).

`podcast.description` is the channel's description of the podcast (*string*).

`podcast.image` is the URL of the podcast's image, which will also be used as the default for any missing episode images (*string*).

`podcast.episodes` is a list of Episode objects contained in this podcast (*list*).


### Episode object
The episode object contains six members: **index**, **title**, **date**, **description**, **image** and **audio**.

`episode.index` - is the order it appeared in the podcast's RSS feed (*integer*).

`episode.title` is the name of the episode (*string*).

`episode.date` is the release date of this episode, formatted in the form of ISO 8601 (*string*).

`episode.description` is the episode's description/notes (*string*).

`episode.image` is the URL of the episode's image, if any episode is missing an image, the podcast's image will be used as a default (*string*).

`episode.image` is the URL of the episode's audio file (*string*).

## Issues or bugs

Any issue or bug reports are welcome and are hugely helpful to the project. Just head over to the Issues tab on GitHub and add an issue.
