export default server => {
  const io = require('socket.io')(server)

  io.on('connection', socket => {
    console.log('< NEW CONNECTION FROM CLIENT > ')

    // To subscribe the socket to a given channel
    socket.on('join', data => {
      socket.join(data.username)
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
      // socket.broadcast.emit('disconnected', onlineUsers[socket.id].username)
    
      // delete onlineUsers[socket.id]
      // socket.broadcast.emit('onlineUsers', onlineUsers)
    })

  })
}