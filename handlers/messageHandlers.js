// import { v4 as uuid } from 'uuid';
// import low from 'lowdb';
// import { LowSync, JSONFileSync } from 'lowdb';

// const { uuid } = require('uuidv4')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// const { LowSync, JSONFileSync} = require('lowdb')
// БД хранится в директории "db" под названием "messages.json"
const adapter = new FileSync('db/messages.json')
const db = low(adapter)
// const db = new LowSync(new JSONFileSync('db/messages.json'))

db.defaults({
    messages: [
        {
            message: "dfgfdgg",
            type: "message",
            userId: "de4e1124-9545-4d53-acae-06c7367c1db6",
            userName: "Test user",
            id: "946e07d6-7e2e-49d6-803b-819dd333f42a"
        }
    ]
}).write()

module.exports = (io, socket) => {
    // обрабатываем запрос на получение сообщений
    const getMessages = () => {
      // получаем сообщения из БД
      const messages = db.get('messages').value()
      // передаем сообщения пользователям, находящимся в комнате
      // синонимы - распространение, вещание, публикация
      console.log('messages: ', messages);
      return messages;
    }

    const addMessage = (message) => {
        db.get('messages')
          .push({
            // messageId: uuid(),
            createdAt: new Date(),
            ...message
          })
          .write()
    
        // выполняем запрос на получение сообщений
        io.to(socket.roomId).emit('chat-broadcast', getMessages())
      }

      const joinMessage = ({userId, userName, roomname}) => {
            //   console.log('user ' + userName + ' joined');
            //   socket.join(roomname);
        db.get('messages')
          .push({
            // messageId: uuid(),
            createdAt: new Date(),
            ...{userId, userName, type: 'info', message: 'joined chat'}
          })
          .write()
    
        // выполняем запрос на получение сообщений
        socket.broadcast.to(socket.roomId).emit('joined', getMessages());
      }

      const leaveMessage = (message) => {
        db.get('messages')
          .push({
            // messageId: uuid(),
            createdAt: new Date(),
            ...{userId, userName, type: 'info', message: 'left chat'}
          })
          .write()
    
        // выполняем запрос на получение сообщений
        socket.broadcast.to(socket.roomId).emit(getMessages())
        socket.leave(socket.roomId)
      }
    // const removeMessage = (messageId) => {
    //     db.get('messages').remove({ messageId }).write()
    
    //     getMessages()
    // }

    socket.on('message:get', getMessages)
    socket.on('my-message', addMessage)
    socket.on('join', joinMessage)
    socket.on('leave', leaveMessage)
    // socket.on('message:remove', removeMessage)
}