var download = require("download")
var timeConversion = require("./time-conversion.js")
var xml2js = require("xml2js")

// CLASSES

/**
 * A Podcast object. Contains 6 members: url, title, description, image and episodes.
 * @param {string} url
 * @param {number} height
 * @property {string} url the URL of the podcast feed, this is the URL given to the parse function
 * @property {string} title the name of the podcast
 * @property {string} date the date of this version of the feed being published, formatted in the form of ISO 8601
 * @property {string} description the channel's description of the podcast
 * @property {string} image he URL of the podcast's image, which will also be used as the default for any missing episode images
 * @property {Array} episodes a list of Episode objects contained in this podcast
 */
class Podcast {
  constructor(url) {
    this.url = url
    this.title = ""
    this.description = ""
    this.image = ""
    this.episodes = []
  }
}

/**
 * An Episode object. Contains 6 members: index, title, description, image and audio.
 * @param {Podcast} podcast
 * @param {number} index
 * @property {number} index the order it appeared in the podcast's RSS feed
 * @property {string} title the name of the episode
 * @property {string} date the release date of this episode, formatted in the form of ISO 8601
 * @property {string} description the episode's description/notes
 * @property {string} image the URL of the episode's image, if any episode is missing an image, the podcast's image will be used as a default
 * @property {string} audio the URL of the episode's audio file
 */
class Episode {
  constructor(podcast, index) {
    this.index = index
    this.title = ""
    this.description = ""
    this.image = podcast.image
    this.audio = ""
  }
}

// FUNCTIONS

function parseTitle(data) {
  return data.rss.channel[0].title[0]
}

function parseDate(data) {
  if(data.rss.channel[0].pubDate != undefined) {
    return timeConversion.convertToStandardTime(data.rss.channel[0].pubDate[0])
  } else if(data.rss.channel[0].lastBuildDate != undefined) {
    return timeConversion.convertToStandardTime(data.rss.channel[0].lastBuildDate[0])
  } else {
    return parseEpisodeDate(data.rss.channel[0].item[0])
  }
}

function parseDescription(data) {
  return data.rss.channel[0].description[0]
}

function parseImage(data) {
  return data.rss.channel[0]["itunes:image"][0]["$"]["href"]
}

function parseEpisodeTitle(item) {
  return item.title
}

function parseEpisodeDate(item) {
  return timeConversion.convertToStandardTime(item.pubDate[0])
}

function parseEpisodeDescription(item) {
  return item.description
}

function parseEpisodeImage(item) {
  if(item["itunes:image"] != undefined) {
    return item["itunes:image"][0]["$"]["href"]
  } else if(item["media:content"] != undefined && item["media:content"][0]["$"]["type"].startsWith("image")) {
    return item["media:content"][0]["$"]["url"]
  }
  return ""
}

function parseEpisodeAudio(item) {
  if(item["enclosure"] != undefined && item["enclosure"][0]["$"]["type"].startsWith("audio")) {
    return item["enclosure"][0]["$"]["url"]
  }
}

function parseEpisode(item, index, podcast) {
  var episode = new Episode(podcast, index)

  episode.title = parseEpisodeTitle(item)
  episode.date = parseEpisodeDate(item)
  episode.description = parseEpisodeDescription(item)
  var episodeImage = parseEpisodeImage(item)
  if(episodeImage != "") {
    episode.image = episodeImage
  }
  episode.audio = parseEpisodeAudio(item)

  podcast.episodes.push(episode)
}

function parseEpisodes(data, podcast) {
  podcast.episodes = []

  var items = data.rss.channel[0].item
  for(var index = 0; index < items.length; index++) {
    parseEpisode(items[index], index, podcast)
  }
}

/**
 * Parses a Podcast object using the plain text body content.
 * @param {string} url the url of the podcast RSS feed you want to parse
 * @param {string} body the plain text body content of the podcast's RSS feed
 * @param {function} callback the function to call with the parsed Podcast object
 * @returns {Podcast} a Podcast object representing that RSS feed's content
 */
function parseBody(url, body, callback) {
  xml2js.parseString(body, function(err, res) {
    if(err) {
      console.log(err)
    } else {
      podcast = new Podcast(url)
      podcast.title = parseTitle(res)
      podcast.date = parseDate(res)
      podcast.description = parseDescription(res)
      podcast.image = parseImage(res)
      parseEpisodes(res, podcast)

      callback(podcast)
    }
  })
}

/**
 * Parses a Podcast object from a URL of the podcast's RSS feed.
 * @param {string} url the url of the podcast RSS feed you want to parse
 * @param {function} callback the function to call with the parsed Podcast object
 * @returns {Podcast} a Podcast object representing that RSS feed's content
 */
function parse(url, callback) {
  download(url).then(function(data) {
    parseBody(url, data, callback)
  })
}


exports.parse = parse
exports.parseBody = parseBody
