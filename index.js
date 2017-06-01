var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){
	io.emit('newuser', 'Someone has connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(msg){
    io.emit('disconnect', 'Someone has disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});