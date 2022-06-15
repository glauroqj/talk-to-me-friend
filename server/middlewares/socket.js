export default (server) => {
  const io = require("socket.io")(server, {
    origins: ["http://localhost:3000", "localhost:3000"],
  });
  // io.set("transports", ["websocket"]);

  io.on("connection", (socket) => {
    console.log("< NEW CONNECTION FROM CLIENT > ");

    socket.on("create-room", (roomName) => {
      console.log("< CREATE ROOM > ", roomName, rooms);
      socket.join(roomName);

      /** check if room exist */
      if (rooms[roomName]) console.log("< ROOM EXIST >");
      if (!rooms[roomName]) {
        console.log("< ROOM DOESNT EXIST : CREATING... >");
        rooms[roomName] = [];
      }
    });

    socket.on("add-user-room", (id, roomName) => {
      // rooms[roomName].push(id)
      if (rooms[roomName]) {
        rooms[roomName].push(id);
        io.in(roomName).emit("add-user-room", rooms, id);
      }
      console.log("< ADD USER IN ROOM > ", rooms, rooms[roomName]);
    });

    socket.on("chat-message", (id, roomName, msg) => {
      // socket.join(data.username)
      // socket.broadcast.emit('stream', data)
      console.log("< MESSAGE > ", id, roomName, msg);
      io.in(roomName).emit("chat-message", {
        userId: id,
        msg,
      });
    });

    // To listen for a client's disconnection from server and intimate other clients about the same
    socket.on("disconnect", () => {
      console.log("< CLIENT DISCONNECTED : SERVER > ", socket.id);

      const roomsKeys = Object.keys(rooms);
      roomsKeys.map((room) => {
        return (rooms[room] = rooms[room].filter((user) => user !== socket.id));
      });
      io.emit("remove-user-room", rooms);
    });
  });
};

/**
  DOC: https://gist.github.com/crtr0/2896891
*/
