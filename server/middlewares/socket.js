export default (server) => {
  const io = require("socket.io")(server, {
    cors: {
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("< NEW CONNECTION FROM CLIENT > ");

    socket.on("create-room", (roomName, userID) => {
      console.log("< CREATE ROOM > ", roomName, userID, rooms);
      socket.join(roomName);
      io.to(roomName).emit("chat-message", "a new user has joined the room");

      /** check if room exist */
      if (rooms[roomName]) {
        console.log("< ROOM EXIST > ", userID);
      }
      if (!rooms[roomName]) {
        console.log("< ROOM DOESNT EXIST : CREATING... >");
        rooms[roomName] = [];
      }
    });

    socket.on("add-user-room", (userID, roomName) => {
      // rooms[roomName].push(userID)
      if (rooms[roomName]) {
        rooms[roomName].push(userID);
        io.in(roomName).emit("add-user-room", rooms, userID);

        /** create room creator */
        if (rooms[roomName].length > 0) {
          const [roomCreator] = rooms[roomName];
          socket.emit("add-user-creator-room", roomCreator);
        }
      }
      console.log("< ADD USER IN ROOM > ", rooms, rooms[roomName]);
    });

    socket.on("chat-message", (userID, roomName, msg) => {
      // socket.join(data.username)
      // socket.broadcast.emit('stream', data)
      console.log("< MESSAGE > ", userID, roomName, msg);
      io.to(roomName).emit("chat-message", {
        id: userID,
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

  https://socket.io/docs/v3/migrating-from-2-x-to-3-0/#CORS-handling
*/
