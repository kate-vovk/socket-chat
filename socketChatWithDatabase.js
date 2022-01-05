const app = require('express')();
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
    const { roomName } = socket.handshake.auth;
    socket.roomName = roomName

    registerMessageHandlers(io, socket)

});

http.listen(3000, () => {
  console.log('listeninghttp on *:3000');
});