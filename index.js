const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
      origins: ['http://localhost:8081']
    }
  });
const DataBase = require("./database.js");

const db = new DataBase();

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});
io.on('connection', (socket) => {
    const user = socket.handshake.auth;

    console.log('a user ' + user.userName + ' connected');
  
    socket.on('disconnect', () => {
      console.log('user ' + user.userName + ' disconnected');
    });

    socket.on('my-message', async (message) => {
        console.log(`${user.userName}: ${message.message}`);
        const data = {
          message: message.message,
          user_id: socket.id,
          name: message.user,
        };
        await db.storeUserMessage(data);
        socket.broadcast.emit('chat-broadcast', message)
    });

    socket.on("joined", async (name) => {
      let messageData = null;
      const data = {
        name,
        user_id: socket.id,
      };
      console.log('try to add new user')
      const user = await db.addUser(data);
      console.log('user joined: ', user)
      if (user) {
        messageData = await db.fetchUserMessages(data);
      }
      socket.broadcast.emit("joined", messageData);
    });
  });
http.listen(3000, () => {
  console.log('listeninghttp on *:3000');
});