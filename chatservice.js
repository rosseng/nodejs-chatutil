var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');

var sockets = new Array();

function allUsers(){
	var users = '';
	sockets.forEach(function(el){
		users += ', ' + el.un;
	});	
	return users.substring(2);
}
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/jquery.scrollintoview.js', function(req, res){
	res.sendFile(__dirname + '/jquery.scrollintoview.js');
});

io.on('connection', function(socket){
	socket.un = "[Somebody]";
	sockets.push(socket);
	socket.on('online users', function(msg) {
		var userParse = JSON.parse(msg);
		this.un = userParse.un;
		console.log('Users online: '.green + allUsers());
		io.emit('online users', allUsers());
	});
	socket.on('chat message', function(msg){
		var json = JSON.parse(msg);
		io.emit('chat message', msg);
		console.log('Username: '.green + json.un + ' |  Message: '.green + json.m);
		console.log(sockets.indexOf(this));
	});
	socket.on('image message', function (msg) {
		var json = JSON.parse(msg);
        io.emit('image message', msg);
		console.log('Username: '.green + json.un + ' |  Sent an image'.yellow);
		console.log(sockets.indexOf(this));
    });
	socket.on('disconnect', function(msg){
		io.emit('disconnect', this.un + ' has disconnected');
		console.log(this.un + ' disconnected'.red);
		var userIndex = sockets.indexOf(this);
		if (typeof userIndex != 'undefined'){
			sockets.splice(userIndex, 1);
		}
		io.emit('online users', allUsers());		
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000'.cyan);
});