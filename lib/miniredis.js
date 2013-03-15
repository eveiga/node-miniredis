var net = require('net');
var util = require('util');
var hiredis = require('hiredis');

module.exports = function(host, port){
  var stream = net.connect({host: host, port: port});
  var reader = new hiredis.Reader({return_buffers: false});
  var commands = [];

  stream.on('data', function(data) {
    var reply;
    reader.feed(data);
    while((reply = reader.get()) !== undefined) {
      var callback = commands.shift();
      if (typeof(callback) === "function") {callback(reply);}
    }
  });

  return Proxy.create({
    get: function(obj, method) {
      function handle(){
        var callback, cmd;
        var args = Array.prototype.slice.call(arguments);

        if (typeof(args[args.length-1]) === "function"){callback = args.pop();}

        cmd = util.format('*%d\r\n', args.length+1);
        cmd += util.format('$%d\r\n%s\r\n', Buffer.byteLength(method), method);
        for (var i=0; i < args.length; i+=1) {
          cmd += util.format(
            '$%d\r\n%s\r\n', Buffer.byteLength(args[i].toString()), args[i]
          );
        }

        stream.write(cmd);
        commands.push(callback);
      }

      return handle;
    }
  });
};