node-miniredis
==============

A tiny redis client in node.js (42 LOCS)!
This is just a proof of concept regarding the use of the Proxy object on node.js.
The main goal was to get rid of the redis commands file and use a more dynamical
approach.

Inspired on:
    https://github.com/stulentsev/miniredis-ruby
and
    https://github.com/eternicode/miniredis-python

### Attention

You'll need to execute node with the flag --harmony. The client depends on new
feature called Proxy Objects (http://wiki.ecmascript.org/doku.php?id=harmony:proxies).

    node --harmony index.js

### Usage

Create client:

    var Redis = require('node-miniredis');
    var client = new Redis("127.0.0.1", 6379);

Simple set/get functions:

    client.set("key", "value");
    client.get("key", function(data){console.log(data)});

Transactions:

    client.multi();
    client.set("numeric", 1);
    client.incr("numeric");
    client.exec(console.log);
