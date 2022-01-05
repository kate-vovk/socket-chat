const { v4: uuidv4 } = require('uuid');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db/messages.json')
const db = low(adapter)

module.exports = (io, socket) => {
    const getMessages = () => {
      const messages = db.get('messages').value()
      return messages;
    }

    const addMessage = (message) => {
        db.get('messages')
          .push({
            messageId: uuidv4(),
            createdAt: new Date(),
            ...message
          })
          .write()
    
        io.to(socket.roomName).emit('chat-broadcast', getMessages())
      }

      const joinMessage = ({userId, userName}) => {
        socket.join(socket.roomName);
        console.log('a user ' + userName + ' connected to ' + socket.roomName);

        db.get('messages')
          .push({
            messageId: uuidv4(),
            createdAt: new Date(),
            ...{userId, userName, type: 'info', message: 'joined chat'}
          })
          .write()
    
        io.to(socket.roomName).emit('chat-broadcast', getMessages());
      }

      const leaveMessage = ({userId, userName}) => {
        db.get('messages')
          .push({
            messageId: uuidv4(),
            createdAt: new Date(),
            ...{userId, userName, type: 'info', message: 'left chat'}
          })
          .write()
    
        io.to(socket.roomName).emit('chat-broadcast', getMessages())
        socket.leave(socket.roomName)
      }

    socket.on('my-message', addMessage)
    socket.on('join', joinMessage)
    socket.on('leave', leaveMessage)
}