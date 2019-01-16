const Twit = require('twit')
const config = require('./config')

const bot = new Twit(config)

var quotes = require('./quotes.json')

var quote = quotes[Math.floor(Math.random()*quotes.length)]
var sanitizedQuote = quote.text.replace(/  /g, " ")
var tweetableQuote = sanitizedQuote

console.log("I just picked a nice quote which would make a good tweet:")
console.log("---------------------------------------------------------")
console.log(quote)
console.log("---------------------------------------------------------")

if (sanitizedQuote.length > 280) {
  console.log("Quote is too long. Trying to reduce length by removing the last sentence or two...")
  var sentences = sanitizedQuote.match( /[^\.!\?]+[\.!\?]+/g )
  var i = sentences.length
  while (i--) {
      if (sentences.join("").length > 280) { // Too long to tweet
        sentences.splice(i, 1) // Remove last sentence
      }
  }
  tweetableQuote = sentences.join("")
  console.log("Reduced quote length from " + quote.text.length + " to " + tweetableQuote.length)
}

console.log("---------------------------------------------------------")
console.log(tweetableQuote)
console.log("---------------------------------------------------------")

console.log("Posting quote to timeline...")
bot.post('statuses/update', { status: tweetableQuote }, function(err, data, response) {
  console.log("---------------------------------------------------------")
  console.log(data)
  console.log("---------------------------------------------------------")
})
