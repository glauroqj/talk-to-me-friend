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

    socket.on("create-room", ({ roomName, userID, name }) => {
      console.log("< CREATE ROOM > ", roomName, userID, rooms);
      socket.join(roomName);
      io.to(roomName).emit("chat-message", {
        message: `a new user has joined the room: ${name}`,
        date: new Date().toLocaleString("pt-BR"),
      });

      /** check if room exist */
      if (rooms[roomName]) {
        console.log("< ROOM EXIST > ", userID);
        users[roomName] = [
          ...users[roomName],
          {
            userID,
            name,
          },
        ];
      }
      if (!rooms[roomName]) {
        console.log("< ROOM DOESNT EXIST : CREATING... >");
        rooms[roomName] = [];
        users[roomName] = [];
        sessionUsers[roomName] = [];
      }
      /** check if user exist ins room */
      console.log("< USER NAME AFTER CREATED  > ", users);
    });

    socket.on("add-user-room", ({ userID, roomName, name }) => {
      // rooms[roomName].push(userID)
      if (rooms[roomName]) {
        rooms[roomName].push(userID);
        io.in(roomName).emit("add-user-room", {
          rooms,
          userID,
          enterUserName: name,
          users: users[roomName],
        });

        /** create room creator */
        if (rooms[roomName].length > 0) {
          const [roomCreator] = rooms[roomName];
          socket.emit("add-user-creator-room", roomCreator);
        }
      }
      console.log("< ADD USER IN ROOM > ", userID, roomName, name);
    });

    socket.on("chat-message", ({ userID, roomName, message, date }) => {
      // socket.join(data.username)
      // socket.broadcast.emit('stream', data)
      console.log("< MESSAGE > ", userID, roomName, message);
      io.to(roomName).emit("chat-message", {
        id: userID,
        message,
        users: users[roomName],
        date,
        // user: {
        //   name: users[roomName].filter(
        //     (payload) => payload.userID === userID
        //   )[0],
        // },
      });
    });

    /** saves id session to insert users names */
    socket.on(
      "add-id-session-from-another-socket",
      ({ userID, sessionID, roomName, session }) => {
        console.log(
          "< ADD ID SESSION FOR TAG NAME > ",
          userID,
          sessionID,
          roomName,
          session
        );

        sessionUsers[roomName] = {
          [userID]: {
            name: session?.name,
            userID,
            sessionID,
          },
          ...sessionUsers[roomName],
        };

        // const newUsersRoomPayload = sessionUsers[roomName].reduce(
        //   (acc, cur) => {
        //     console.log(cur, acc);
        //     if (cur.userID === userID) {
        //       cur.sessioID = sessionID;
        //     }
        //     acc = acc?.length > 0 ? [...acc, cur] : [cur];
        //     return acc;
        //   },
        //   []
        // );

        // sessionUsers[roomName] = [...newUsersRoomPayload];

        console.log("< sessionUsers > ", sessionUsers[roomName]);

        io.to(roomName).emit("add-id-session-from-another-socket", {
          userID,
          sessionID,
          roomName,
          sessionUsers: sessionUsers[roomName],
        });
      }
    );

    // To listen for a client's disconnection from server and intimate other clients about the same
    socket.on("disconnect", () => {
      console.log("< CLIENT DISCONNECTED : SERVER > ", socket?.id);

      const roomsKeys = Object.keys(rooms);
      roomsKeys.map((room) => {
        return (rooms[room] = rooms[room].filter((user) => user !== socket.id));
      });

      const usersKey = Object.keys(users);

      let leftUserPayload = { name: "", image: "" };
      let remainingUsers = [];

      usersKey.map((room) => {
        delete sessionUsers[room][socket?.id];

        /** take the exited user */
        leftUserPayload = users[room].filter(
          (payload) => payload?.userID === socket?.id
        )[0];

        remainingUsers = users[room] = users[room].filter(
          (payload) => payload?.userID !== socket.id
        );

        return remainingUsers;
      });

      console.log(
        "< CLIENT DISCONNECTED : SERVER > ",
        socket.id,
        usersKey,
        leftUserPayload,
        remainingUsers
      );
      io.emit("remove-user-room", {
        rooms,
        leftUser: leftUserPayload,
        remainingUsers,
      });
    });
  });
};

/**
  DOC: https://gist.github.com/crtr0/2896891

  https://socket.io/docs/v3/migrating-from-2-x-to-3-0/#CORS-handling
*/
