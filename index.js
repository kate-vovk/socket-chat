const app = require('express')();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//     cors: {
//       origins: ['http://localhost:8081']
//     }
//   });

// app.get('/', (req, res) => {
//   res.send('<h1>Hey Socket.io</h1>');
// });

// io.on('connection', (socket) => {
//     const user = socket.handshake.auth;

//     console.log('a user ' + user.userName + ' connected');
  
//     socket.on('join', ({userId, userName, roomname}) => {
//       console.log('user ' + userName + ' joined');
//       socket.broadcast.to(roomname).emit('joined', {userId, userName, type: 'info', message: 'joined chat'});
//       socket.join(roomname);
//     });

//     socket.on('leave', ({userId, userName, roomname}) => {
//       console.log('user ' + userName + ' left chat');
//       socket.broadcast.to(roomname).emit('left', {userId, userName, type: 'info', message: 'left chat'});
//     });

//     socket.on('my-message', ({message, userId, userName, roomname}) => {
//       console.log(userName + ' wrote message: ' + message);
//       io.to(roomname).emit('chat-broadcast', {userId, userName, type: 'message', message});

//     });

//   });

// http.listen(3000, () => {
//   console.log('listeninghttp on *:3000');
// });


const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: {
      origins: '*'
    }
  });
const registerMessageHandlers = require('./handlers/messageHandlers.js')

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
    const { userName,  roomId} = socket.handshake.auth;
    socket.roomId = roomId

    console.log('a user ' + userName + ' connected to ' + roomId);

    registerMessageHandlers(io, socket)

  });

http.listen(3000, () => {
  console.log('listeninghttp on *:3000');
});