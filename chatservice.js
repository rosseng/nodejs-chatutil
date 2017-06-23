var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var users = new Array();
var sockets = new Array();

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/jquery.scrollintoview.js', function(req, res){
	res.sendFile(__dirname + '/jquery.scrollintoview.js');
});

io.on('connection', function(socket){
//	socket.id = Math.floor(Math.random() * 1000);
	sockets.push(socket);
	socket.on('online users', function(msg) {
		var userParse = JSON.parse(msg);
		users.push(userParse.un);
		console.log('Users online: '.green + users);
		io.emit('online users', users.join(', '));
	});
	socket.on('chat message', function(msg){
		var json = JSON.parse(msg);
		io.emit('chat message', msg);
		console.log('Username: '.green + json.un + ' |  Message: '.green + json.m);
		console.log(sockets.indexOf(this));
	});
	socket.on('disconnect', function(msg){
		var userIndex = sockets.indexOf(this);
		if (typeof(users[userIndex]) == 'undefined'){
			io.emit('disconnect', 'Somebody has disconnected');
			return;
		}
		io.emit('disconnect', users[userIndex] + ' has disconnected');
		console.log(users[userIndex] + ' disconnected'.red);
		users.splice(userIndex, 1);
		sockets.splice(userIndex, 1);
		io.emit('online users', users);		
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000'.cyan);
});