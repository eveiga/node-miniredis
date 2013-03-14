node-miniredis
==============

A tiny redis client in node.js!

Inspired on:
    https://github.com/stulentsev/miniredis-ruby
and
    https://github.com/eternicode/miniredis-python

### Usage

You'll need to execute node with the flag --harmony. The client depends on new
feature called Proxy Objects (http://wiki.ecmascript.org/doku.php?id=harmony:proxies).

    var Redis = require('node-miniredis');

    var client = new Redis("127.0.0.1", 6379);

    client.set("key", "value", function(data){console.log(data)});
    client.get("key", function(data){console.log(data)});
