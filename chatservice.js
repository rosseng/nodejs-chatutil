var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var users = new Array();

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/jquery.scrollintoview.js', function(req, res){
	res.sendFile(__dirname + '/jquery.scrollintoview.js');
});

io.on('connection', function(socket){
	socket.id = Math.floor(Math.random() * 1000);
	socket.on('online users', function(msg) {
		var userParse = JSON.parse(msg);
		users += userParse.un + ', ';
		console.log('Users online: '.green + users);
		io.emit('online users', users);
	});
	socket.on('chat message', function(msg){
		var json = JSON.parse(msg);
		io.emit('chat message', msg);
		console.log('Username: '.green + json.un + ' |  Message: '.green + json.m);
	});
	socket.on('disconnect', function(msg){
		io.emit('disconnect', 'Someone has disconnected');
		console.log('User disconnected'.red);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000'.cyan);
});