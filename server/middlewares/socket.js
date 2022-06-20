export default (server) => {
  const io = require("socket.io")(server, {
    cors: {
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });
  const p2p = require("socket.io-p2p-server").Server;
  io.use(p2p);

  io.on("connection", (socket) => {
    console.log("< NEW CONNECTION FROM CLIENT > ");

    socket.on("create-room", (roomName, userID) => {
      console.log("< CREATE ROOM > ", roomName, userID, rooms);
      socket.join(roomName);
      p2p(socket, null, roomName);

      io.to(roomName).emit("chat-message", "a new user has joined the room");
      // socket.to(roomName).broadcast.emit("user-connected", userID);

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

    /** news */
    socket.on("start_call", (roomId) => {
      console.log(`Broadcasting start_call event to peers in room ${roomId}`);
      socket.broadcast.to(roomId).emit("start_call");
    });
    socket.on("webrtc_offer", (event) => {
      console.log(
        `Broadcasting webrtc_offer event to peers in room ${event.sdp} ${event.roomId} ${event.userID}`
      );
      socket.broadcast.to(event?.roomId).emit("webrtc_offer", event.sdp);
    });
    socket.on("webrtc_answer", (event) => {
      console.log(
        `Broadcasting webrtc_answer event to peers in room ${event.sdp} ${event.roomId} ${event.userID}`
      );
      socket.broadcast.to(event?.roomId).emit("webrtc_answer", event?.sdp);
    });
    socket.on("webrtc_ice_candidate", (event) => {
      console.log(
        `Broadcasting webrtc_ice_candidate event to peers in room ${event.sdp} ${event.roomId} ${event.userID}`
      );
      socket.broadcast.to(event?.roomId).emit("webrtc_ice_candidate", event);
    });
  });
};

/**
  DOC: https://gist.github.com/crtr0/2896891

  https://socket.io/docs/v3/migrating-from-2-x-to-3-0/#CORS-handling
*/
