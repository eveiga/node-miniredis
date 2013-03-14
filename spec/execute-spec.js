var assert = require('assert');
var MiniRedis = require('../lib/miniredis.js');

require('mocha');

var client = new MiniRedis("127.0.0.1", 6379);

beforeEach(function () {
  return client.flushdb();
});

describe('get', function () {
  describe('when a key exists', function () {
    var key = 'key';
    var expectedData = 'value';
    beforeEach(function () {
      return client.set(key, expectedData);
    });

    it('returns its value', function () {
      return client.get(key, function(data){
        assert.strictEqual(data, expectedData);
      });
    });
  });
});