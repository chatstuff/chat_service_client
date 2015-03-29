var express = require("express");
var app = express();
var port = 3701;


app.listen(port);
console.log("Listening on port " + port);

var io = require('socket.io-client');

var clientIds = ['9868411311', '9739517079'];
var clients = [];


register = function(client, clientId){
	client.emit("register", {clientId: clientId}, function(err, data){
		if (err){
			console.log("Registration Error:: " + JSON.stringify(err) + ' for client: ' + clientId);
		}
		else{
			console.log('Registration success:: ' + JSON.stringify(data) + ' for client: ' + clientId);
		}
	});
};

clientIds.forEach(function(clientId){
	var client = io.connect("ws://chat_service:8080", {'force new connection': true});
	clients.push(client);

	client.on('connect',function() {
		// console.log("CONNECTED!!! :" + client.io.engine.id);
		console.log("CONNECTED!!! client:" + clientId + ' client id: ' + clientId);
		register(client, clientId);
	});

	client.on('reconnect',function(num) {
		console.log("RECONNECTED!!! : " + num + ' id: ' + client.io.engine.id + ' client id: ' + clientId);
	});

	client.on('reconnecting',function(num) {
		console.log("RECONNECTING!!! : " + num + ' client id: ' + clientId);
	});
	client.on('error',function(err) {
		console.log("ERROR!!! : " + err.message + ' client id: ' + clientId);
	});

	client.on('message', function(data) {
	  console.log('Received message on event: message. data: ' + JSON.stringify(data) + ' client id: ' + clientId)
	});

	client.on('chat', function(data, callback) {
	  console.log('Received message on event: chat. data: ' + JSON.stringify(data) + ' client id: ' + clientId)
	  callback(null, {clientId: clientId, text: 'got it!'});
	});
});

app.get("/", function(req, res){
  // res.send(req.query);
  console.log('Received req: ' + JSON.stringify(req.query));
  clients[0].emit(req.query.event ? req.query.event : "chat", {clientId: '9868411311', text: req.query.text ? req.query.text : 'test', msg_id: Date.now()}, function(err, data){
  	if (err){
  		console.log("Error:: " + JSON.stringify(err));
  	}
  	else{
  		console.log('success:: ' + JSON.stringify(data));
  	}
  });
  res.end();
});
