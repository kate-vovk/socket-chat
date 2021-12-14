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
    const user = socket.handshake.auth.userId;

    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('my message', (msg) => {
        console.log(`${user}: ${msg}`)
        io.emit('my broadcast', `${user}: ${msg}`)
    })
  });
http.listen(3000, () => {
  console.log('listeninghttp on *:3000');
});