export default server => {
  const io = require('socket.io')(server)
  io.set('transports', ['websocket'])

  io.on('connection', socket => {
    console.log('< NEW CONNECTION FROM CLIENT > ')
    
    socket.on('create-room', roomName => {
      console.log('< CREATE ROOM > ', roomName, rooms)
      socket.join(roomName)

      /** check if room exist */
      if ( rooms[roomName] ) console.log('< ROOM EXIST >')
      if ( !rooms[roomName] ) {
        console.log('< ROOM DOESNT EXIST : CREATING... >')
        rooms[roomName] = []
      }
    })

    socket.on('add-user-room', (id, roomName) => {
      // rooms[roomName].push(id)
      console.log('< ADD USER IN ROOM > ', rooms, rooms[roomName])
      if ( rooms[roomName] ) {
        rooms[roomName].push(id)
        io.in(roomName).emit('add-user-room', rooms[roomName])
      }
    })

    socket.on('remove-user-room', (id, roomName) => {
      console.log('< REMOVE USER IN ROOM > ', id, rooms[roomName])
      if ( rooms[roomName] ) {
        rooms[roomName] = rooms[roomName].filter(user => user !== id)
        io.in(roomName).emit('remove-user-room', rooms[roomName])
      }
    })

    socket.on('chat-message', (id, roomName, msg) => {
      // socket.join(data.username)
      // socket.broadcast.emit('stream', data)
      console.log('< MESSAGE > ', id, roomName, msg)
      io.in(roomName).emit('chat-message', msg)
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
      console.log('< CLIENT DISCONNECTED : SERVER > ', data)
      // socket.broadcast.emit('disconnected', onlineUsers[socket.id].username)
    
      // delete onlineUsers[socket.id]
      // socket.broadcast.emit('onlineUsers', onlineUsers)
    })

  })
}

/**
  DOC: https://gist.github.com/crtr0/2896891
*/