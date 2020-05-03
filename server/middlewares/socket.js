export default server => {
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    console.log('< NEW CONNECTION FROM CLIENT > ')


    socket.on('stream', data => {
      // socket.join(data.username)
      // socket.broadcast.emit('stream', data)
      console.log('< STREAM > ', data)
    })
    
    // To keep track of online users
    // socket.on('userPresence', data => {
    //   onlineUsers[socket.id] = {
    //     username: data.username
    //   }
    //   socket.broadcast.emit('onlineUsers', onlineUsers)
    // })
    
    // For message passing
    // socket.on('message', data => {
    //   io.sockets.to(data.toUsername).emit('message', data.data)
    // })
    
    // To listen for a client's disconnection from server and intimate other clients about the same
    socket.on('disconnect', data => {
      console.log('< CLIENT DISCONNECTED > ')
      // socket.broadcast.emit('disconnected', onlineUsers[socket.id].username)
    
      // delete onlineUsers[socket.id]
      // socket.broadcast.emit('onlineUsers', onlineUsers)
    })

  })
}