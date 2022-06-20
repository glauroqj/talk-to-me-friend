import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
// import P2P from "socket.io-p2p";
/** component */
import Channel from "components/Channel/Channel";

const Room = () => {
  let socket = null;
  let checkAgain = null;

  const [state, setState] = useState({
    socket: {
      disconnected: "",
    },
    roomCreatorID: "",
  });

  const [roomCreator, setRoomCreator] = useState("");

  useEffect(() => {
    connectSocket();
  }, []);

  const connectSocket = () => {
    console.log("< CONNECT SOCKET > ", process.env.NODE_ENV);
    const defineURL = () =>
      process.env.NODE_ENV === "development"
        ? `localhost:9000`
        : `https://talk-to-me-friend.herokuapp.com`;

    socket = io(String(defineURL()));
    // const p2p = new P2P(socket);

    // p2p.on("peer-msg", function (data) {
    //   console.log("From a peer %s", data);
    // });

    socket.on("connect", () => {
      console.log("< CLIENT SOCKET CONNECTED > ", socket?.id);
      socket.emit("create-room", String(window.location.pathname), socket?.id);
      socket.emit("add-user-room", socket.id, String(window.location.pathname));

      setState({
        ...state,
        socket,
      });
      // handleConnection()
    });

    socket.on("add-user-creator-room", (roomCreatorID) => {
      console.log("< ROOM CREATOR > ", roomCreatorID);
      setRoomCreator(roomCreatorID);
    });

    socket.on("add-user-room", (users, userId) => {
      console.log("< ADD USER ROOM > ", users, userId);
      // if (userId && userId !== socket.id && !document.getElementById(`attendant-${userId}`) ) {
      //   /** create image for attendant */
      //   let node = document.createElement('video')
      //   node.setAttribute('autoplay', 'autoplay')
      //   node.setAttribute('id', `attendant-${userId}`)
      //   document.getElementById('attendants').appendChild(node)
      // }
    });

    socket.on("remove-user-room", (rooms) => {
      console.log("< REMOVE USER FROM ROOM > ", rooms);
    });

    let count = 0;
    checkAgain = setInterval(() => {
      console.log("< INTERVAL CHECK > ", count, socket);
      if (socket?.disconnect && count >= 5) {
        console.log("< SOCKET NOT CONNECTED > ", socket);
        setState({
          ...state,
          socket,
        });
        clearInterval(checkAgain);
      }
      if (socket?.connected) clearInterval(checkAgain);
      count++;
    }, 1000);
  };

  return <Channel socket={state.socket} roomCreatorID={roomCreator} />;
};

export default Room;
