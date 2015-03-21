var io = require('socket.io/node_modules/socket.io-client');

client = io.connect("http://localhost:3700");

client.on('connect',function() {
	console.log("CONNECTED!!!");
  client.emit("test","foo");
}); 
client.on('message', function(data) {
  console.log('Received data: ' + JSON.stringify(data))
});
