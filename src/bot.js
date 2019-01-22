const Twit = require('twit')
const config = require('./config')
const quotes = require('./quotes.json')

const bot = new Twit(config)

var quote = quotes[Math.floor(Math.random()*quotes.length)]
var sanitizedQuote = sanitizeQuote(quote)
var tweetableQuote = sanitizedQuote

console.log("I just picked a nice quote which would make a good tweet:")
console.log("---------------------------------------------------------")
console.log(quote)
console.log("---------------------------------------------------------")

if (sanitizedQuote.length > 280) {
  tweetableQuote = shortenQuote(sanitizedQuote)
}

if (config.post_to_twitter) {
  console.log("Posting quote to timeline...")
  bot.post('statuses/update', { status: tweetableQuote }, function(err, data, response) {
    console.log("---------------------------------------------------------")
    console.log(data)
    console.log("---------------------------------------------------------")
  })
} else {
  console.log(tweetableQuote)
  console.log("---------------------------------------------------------")
  console.log("Not posting quote to timeline. ENV var POST_TO_TWITTER has to be set to true.")
}

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

module.exports.shortenQuote = shortenQuote;
