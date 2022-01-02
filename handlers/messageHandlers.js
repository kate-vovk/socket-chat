const { v4: uuidv4 } = require('uuid');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// БД хранится в директории "db" под названием "messages.json"
const adapter = new FileSync('db/messages.json')
const db = low(adapter)

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

    const passAllMessages = () => {
      // выполняем запрос на получение сообщений
      console.log('passAllMessages');
      io.to(socket.roomId).emit('chat-broadcast', getMessages())
    }

    const addMessage = (message) => {
        db.get('messages')
          .push({
            messageId: uuidv4(),
            createdAt: new Date(),
            ...message
          })
          .write()
    
        // выполняем запрос на получение сообщений
        io.to(socket.roomId).emit('chat-broadcast', getMessages())
      }

      const joinMessage = ({userId, userName, roomname}) => {
        console.log('user ' + userName + ' joined');
        socket.join(socket.roomId);
        db.get('messages')
          .push({
            messageId: uuidv4(),
            createdAt: new Date(),
            ...{userId, userName, type: 'info', message: 'joined chat'}
          })
          .write()
    
        // выполняем запрос на получение сообщений
        io.to(socket.roomId).emit('chat-broadcast', getMessages());
      }

      const leaveMessage = ({userId, userName}) => {
        db.get('messages')
          .push({
            messageId: uuidv4(),
            createdAt: new Date(),
            ...{userId, userName, type: 'info', message: 'left chat'}
          })
          .write()
    
        // выполняем запрос на получение сообщений
        io.to(socket.roomId).emit('chat-broadcast', getMessages())
        socket.leave(socket.roomId)
      }
    // const removeMessage = (messageId) => {
    //     db.get('messages').remove({ messageId }).write()
    
    //     getMessages()
    // }

    socket.on('message:get', passAllMessages)
    socket.on('my-message', addMessage)
    socket.on('join', joinMessage)
    socket.on('leave', leaveMessage)
    // socket.on('message:remove', removeMessage)
}