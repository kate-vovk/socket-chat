const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:8081']
    }
  });

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
    const user = socket.handshake.auth;

    console.log('a user ' + user.userName + ' connected');
  
    socket.on('join', ({userId, userName}) => {
      console.log('user ' + userName + ' joined');
      socket.broadcast.emit('joined', {userId, userName, type: 'info', message: 'joined chat'});
    });

    socket.on('leave', ({userId, userName}) => {
      console.log('user ' + userName + ' left chat');
      socket.broadcast.emit('left', {userId, userName, type: 'info', message: 'left chat'});
    });

    socket.on('my-message', ({message, userId, userName}) => {
      console.log(userName + ' wrote message: ' + message);
      // socket.emit('chat-broadcast', {userId, userName, type: 'message', message});
      io.emit('chat-broadcast', {userId, userName, type: 'message', message});

    });

  });

http.listen(3000, () => {
  console.log('listeninghttp on *:3000');
});