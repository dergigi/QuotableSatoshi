const Twit = require('twit')
const config = require('./config')
const quotes = require('./quotes.json')

const bot = new Twit(config)

var quote = quotes[Math.floor(Math.random()*quotes.length)]
var sanitizedQuote = sanitizeQuote(quote)
var tweetableQuote = shortenQuote(sanitizedQuote)

postQuote(tweetableQuote)

function sanitizeQuote(quote) {
  return quote.text.replace(/  /g, " ")
}

function shortenQuote(quote) {
  var sentences = quote.match( /[^\.!\?]+[\.!\?]+/g )
  var i = sentences.length
  while (i--) {
      if (sentences.join("").length > config.character_limit) { // Too long to tweet
        sentences.splice(i, 1) // Remove last sentence
      }
  }
  shortenedQuote = sentences.join("")
  return shortenedQuote
}

function postQuote(quote) {
  if (config.post_to_twitter) {
    console.log("Posting quote to timeline...")
    bot.post('statuses/update', { status: quote }, function(err, data, response) {
      console.log(data)
    })
  } else {
    console.log(quote)
    console.log("(Not posting quote to timeline. ENV var POST_TO_TWITTER has to be set to true.)")
  }
}

module.exports.shortenQuote = shortenQuote;
