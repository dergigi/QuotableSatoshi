const Twit = require('twit')
const config = require('./config')
const quotes = require('./quotes.json')

const bot = new Twit(config)

const WHITEPAPER_URL = 'https://bitcoin.org/bitcoin.pdf'
const BITCOINTALK_URL = 'https://satoshi.nakamotoinstitute.org/posts/bitcointalk/'
const EMAIL_URL = 'https://satoshi.nakamotoinstitute.org/emails/cryptography/'
const P2PFOUNDATION_URL = 'https://satoshi.nakamotoinstitute.org/posts/p2pfoundation/'

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
  if (quote.length < config.character_limit) {
    return quote
  }

  // Try to remove sentences
  var shortenedQuote = quote
  var sentences = quote.match(/[^\.!\?]+[\.!\?]+/g)
  if (sentences) {
    var i = sentences.length
    while (i--) {
        if (sentences.join("").length > config.character_limit) { // Too long to tweet
          sentences.splice(i, 1) // Remove last sentence
        }
    }
    shortenedQuote = sentences.join("")
  }

  // Shortening might have failed, e.g. if the first sentence is really long
  // or no sentences were detected
  if (shortenedQuote.length > config.character_limit || shortenedQuote === "") {
    return quote.substring(0, config.character_limit - 3) + "..."
  }

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

function getRepliesAskingForSource(callback) {
  bot.get('search/tweets', { q: 'to:@QuotableSatoshi source', count: 100 }, callback)
}

function isAwaitingReply(tweet, callback) {
  var since_id = tweet.id_str
  bot.get('search/tweets', { q: 'from:@QuotableSatoshi to:' + tweet.user.screen_name, since_id: since_id, count: 10 }, callback)
}

function replyAllWithSource() {
  // 1. Get list of tweets asking for source
  getRepliesAskingForSource(function(err, data, response) {
    if (err) {
      console.log(err)
    } else {
      data.statuses.forEach(s => {
  // 2. Get parent tweet for every tweet asking for source
        console.log(s.text)
        console.log(s.user.screen_name)
      })
    }
  })
  // 3. Get quote from parent tweet

  // 4. Look up quote source
  // 5. Reply to tweet with quote source
}

function replyWithSource(tweet, callback) {
  console.log("Getting parent tweet for " + tweet.text)
  getParentTweet(tweet, function(err, data, response) {
    console.log("Got parent tweet: ")
    console.log(data)
    var source = getQuoteMetadata(data.text)

    var reply = '@'
    reply += tweet.user.screen_name
    reply += ' Satoshi wrote this on '
    // tweet.user.screen_name

    if (config.post_to_twitter) {
      bot.post('statuses/update', { status: quote_source, in_reply_to_status_id: tweet.id_str }, function(err, data, response) {
        console.log(data)
      })
    } else {
      console.log(source)
      console.log("(Not posting quote to timeline. ENV var POST_TO_TWITTER has to be set to true.)")
    }
  })
}

function getQuoteMetadata(quote, callback) {
  var PATTERN = new RegExp(quote);
  var matched_quotes = quotes.filter(function (q) { return PATTERN.test(q.text); });
  if (!matched_quotes || matched_quotes.length > 1) {
    return null;
  }

  var quote_entry = matched_quotes[0]
  var source = null
  switch(quote_entry.medium) {
    case "whitepaper":
      source = WHITEPAPER_URL;
      break;
    case "email":
      source = EMAIL_URL + quote_entry.email_id;
      break;
    case "bitcointalk":
      source = BITCOINTALK_URL + quote_entry.post_id;
      break;
    case "p2pfoundation":
      source = P2PFOUNDATION_URL + quote_entry.post_id;
      break;
    default:
      source = null;
      break;
  }

  quote_entry['source'] = source;

  return quote_entry
}

function getParentTweet(tweet, callback) {
  bot.get('statuses/show/:id', { id: tweet.in_reply_to_status_id_str }, callback)
}

module.exports.shortenQuote = shortenQuote;
module.exports.quotes = quotes;
module.exports.getRepliesAskingForSource = getRepliesAskingForSource;
module.exports.replyWithSource = replyWithSource;
module.exports.getParentTweet = getParentTweet;
module.exports.isAwaitingReply = isAwaitingReply;
module.exports.getQuoteMetadata = getQuoteMetadata;
