var assert = require('assert');
var bot = require('../src/bot');

describe('quotableSatoshi', function() {
  describe('#getRepliesAskingForSource()', function() {
    it('should get at least one reply', function() {
      bot.getRepliesAskingForSource(onSearchComplete)
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
  }
}
