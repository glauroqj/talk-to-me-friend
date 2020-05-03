export default server => {
  const io = require('socket.io')(server)
  io.set('transports', ['websocket'])

  io.on('connection', socket => {
    console.log('< NEW CONNECTION FROM CLIENT > ')


    socket.on('chat message', (id, msg) => {
      // socket.join(data.username)
      // socket.broadcast.emit('stream', data)
      console.log('< MESSAGE > ', msg)
      io.to(id).emit('chat message', msg)
    })

    socket.on('stream', (id, data) => {
      // console.log('< STREAM > ', data)
      socket.broadcast.to(id).emit('stream', data)
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
      console.log('< CLIENT DISCONNECTED > ', data)
      // socket.broadcast.emit('disconnected', onlineUsers[socket.id].username)
    
      // delete onlineUsers[socket.id]
      // socket.broadcast.emit('onlineUsers', onlineUsers)
    })

  })
}