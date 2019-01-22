const Twit = require('twit')
const config = require('./config')
const quotes = require('./quotes.json')

const bot = new Twit(config)

// Pick a random quote
var quote = quotes[Math.floor(Math.random()*quotes.length)]

// Sanitze quote (remove double spaces)
var sanitizedQuote = sanitizeQuote(quote)

// Reduce length of quote to fit twitter
var tweetableQuote = shortenQuote(sanitizedQuote)

// Post quote to twitter
postQuote(tweetableQuote)

/**
 * Get rid of Satoshi's double spaces since they use up valuable
 * textblock space.
 * @param {string} quote - The quote uttered by Satoshi.
*/
function sanitizeQuote(quote) {
  return quote.text.replace(/  /g, " ")
}

/**
 * Reduces quote length by stripping away sentences until it fits
 * the character limit defined in the config.
 * @param {string} quote - The quote uttered by Satoshi.
 */
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

/**
 * Post quote to Twitter.
 * @param {string} quote - The quote uttered by Satoshi.
*/
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
