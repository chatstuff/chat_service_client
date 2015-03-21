var express = require("express");
var app = express();
var port = 3701;


app.listen(port);
console.log("Listening on port " + port);

var io = require('socket.io/node_modules/socket.io-client');

client = io.connect("http://localhost:3700");

client.on('connect',function() {
	console.log("CONNECTED!!!");
  client.emit("test","foo");
}); 
client.on('message', function(data) {
  console.log('Received message on event: message. data: ' + JSON.stringify(data))
});


app.get("/", function(req, res){
  // res.send(req.query);
  client.emit(req.query.event ? req.query.event : "send", req.query.message ? req.query.message : "Test data my friend");
});