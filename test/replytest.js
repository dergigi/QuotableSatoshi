var assert = require('assert');
var bot = require('../src/bot');

const REPLY_TWEET_ID = '1088949574264414213'
const EXPECTED_ROOT_TWEET_ID = '1085371334950092800'
const TWEET_ASKING_FOR_SOURCE = require('./assets/tweet_asking_for_source.json')

const QUOTE_BITCOINTALK = 'At equilibrium size, many nodes will be server farms with one or two network nodes that feed the rest of the farm over a LAN.'
const QUOTE_BITCOINTALK_SOURCE = 'https://satoshi.nakamotoinstitute.org/posts/bitcointalk/188'

const QUOTE_WHITEPAPER = 'A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution.'
const QUOTE_WHITEPAPER_SOURCE = 'https://bitcoin.org/bitcoin.pdf'

const QUOTE_EMAIL = 'It might make sense just to get some in case it catches on. If enough people think the same way, that becomes a self fulfilling prophecy.'
const QUOTE_EMAIL_SOURCE = 'https://satoshi.nakamotoinstitute.org/emails/cryptography/17'

describe('quotableSatoshi', function() {
  describe('#getParentTweet()', function() {
    it('should get the correct root tweet id of a reply', function() {
      bot.getParentTweet(REPLY_TWEET_ID, function(err, data, response) {
        assert.equal(data.id_str, EXPECTED_ROOT_TWEET_ID, 'tweet id is the expected root tweet id')
        assert.equal(data.user.screen_name, 'dergigi')
      })
    });
  });
  describe('#isAwaitingReply()', function() {
    it('should detect if tweet asking for source was replied to', function() {
      bot.isAwaitingReply(TWEET_ASKING_FOR_SOURCE, function(err, data, response) {
        assert.equal(data.statuses.length, 0, 'statuses should be empty')
      });
    });
  });
  describe('#getSourceForQuote()', function() {
    it('should look up the source of a bitcointalk quote correctly', function() {
      var source = bot.getSourceForQuote(QUOTE_BITCOINTALK);
      assert.equal(source, QUOTE_BITCOINTALK_SOURCE);
    });
    it('should look up the source of a whitepaper quote correctly', function() {
      var source = bot.getSourceForQuote(QUOTE_WHITEPAPER);
      assert.equal(source, QUOTE_WHITEPAPER_SOURCE);
    });
    it('should look up the source of a email quote correctly', function() {
      var source = bot.getSourceForQuote(QUOTE_EMAIL);
      assert.equal(source, QUOTE_EMAIL_SOURCE);
    });
  });
});

function onSearchComplete(err, data, response) {
  if (err) {
    fail("Search should not throw an error")
  }
  if (data) {
    console.log(data)
    assert.equal(data.count > 0, true)
  } else {
    fail("No data received")
  }
}
