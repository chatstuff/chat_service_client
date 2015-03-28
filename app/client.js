var express = require("express");
var app = express();
var port = 3701;


app.listen(port);
console.log("Listening on port " + port);

var io = require('socket.io-client');


var register = function(){
	client.emit("register", {clientId: '98798779'}, function(err, data){
		if (err){
			console.log("Registration Error:: " + JSON.stringify(err));
		}
		else{
			console.log('Registration success:: ' + JSON.stringify(data));
		}
	});
};


var client = io.connect("ws://chat_service:8080");
// client = io.connect("ws://localhost:6001");

client.on('connect',function() {
	console.log("CONNECTED!!! :" + client.io.engine.id);
	register();
}); 

client.on('reconnect',function(num) {
	console.log("RECONNECTED!!! : " + num + ' id: ' + client.io.engine.id);
});

client.on('reconnecting',function(num) {
	console.log("RECONNECTING!!! : " + num);
});

client.on('reconnecting',function() {
	console.log("CONNECTING!!! : ");
});

client.on('error',function(err) {
	console.log("ERROR!!! : " + err.message);
});

client.on('message', function(data) {
  console.log('Received message on event: message. data: ' + JSON.stringify(data))
});




app.get("/", function(req, res){
  // res.send(req.query);
  console.log('Received req: ' + JSON.stringify(req.query));
  client.emit(req.query.event ? req.query.event : "chat", {clientId: '98798779', text: req.query.text ? req.query.text : 'test', msg_id: Date.now()}, function(err, data){
  	if (err){
  		console.log("Error:: " + JSON.stringify(err));
  	}
  	else{
  		console.log('success:: ' + JSON.stringify(data));
  	}
  });
  res.end();
});
