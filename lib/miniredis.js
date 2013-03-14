/*global Proxy:true*/
var net = require('net');
var util = require('util');
var hiredis = require('hiredis');

module.exports = function(host, port){
  var client = net.connect({host: host, port: port});
  var reader = new hiredis.Reader({return_buffers: false});
  var commands = [];

  client.on('data', function(data) {
    reader.feed(data);

    var reply;
    while (true) {
      try {
        reply = reader.get();
      } catch (err) {
        break;
      }

      if (reply === undefined){
        break;
      }

      var callback = commands.shift();
      if (typeof(callback) === "function") { callback(reply); }
    }
  });

  return Proxy.create({
    get: function(obj, method) {
      function handle(){
        var callback, cmd;
        var args = Array.prototype.slice.call(arguments);

        if (typeof(args[args.length-1]) === "function") {
          callback = args.pop();
        }

        cmd = util.format('*%d\r\n', args.length+1);
        cmd += util.format('$%d\r\n%s\r\n', Buffer.byteLength(method), method);

        for (var i=0; i < args.length; i+=1) {
          cmd += util.format(
            '$%d\r\n%s\r\n', Buffer.byteLength(args[i].toString()), args[i]
          );
        }

        client.write(cmd);
        commands.push(callback);
      }

      return handle;
    }
  });
};