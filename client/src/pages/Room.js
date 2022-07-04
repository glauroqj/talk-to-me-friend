import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
// import P2P from "socket.io-p2p";
/** component */
import Channel from "components/Channel/Channel";
import Loading from "components/Loading/Loading";
/** providers */
import { useSession } from "providers/SessionProvider";
/** notification */
import { toast } from "react-toastify";

const Room = () => {
  const { session } = useSession();
  let socket = null;
  let checkAgain = null;

  const [state, setState] = useState({
    socket: {
      disconnected: "",
    },
    roomCreatorID: "",
  });

  const [roomCreator, setRoomCreator] = useState("");

  const [usersRoom, setUsersRoom] = useState([]);

  useEffect(() => {
    !session?.isLoading && connectSocket();
  }, [session, session?.isLoading]);

  const connectSocket = () => {
    console.log("< CONNECT SOCKET > ", process.env.NODE_ENV);
    const defineURL = () =>
      process.env.NODE_ENV === "development"
        ? `localhost:9000`
        : `https://talk-to-me-friend.herokuapp.com`;

    socket = io(String(defineURL()));

    socket.on("connect", () => {
      console.log("< CLIENT SOCKET CONNECTED > ", {
        userID: socket?.id,
        name: session?.name,
      });
      socket.emit("create-room", {
        roomName: String(window.location.pathname),
        userID: socket?.id,
        name: session?.name,
      });
      socket.emit("add-user-room", {
        userID: socket?.id,
        roomName: String(window.location.pathname),
        name: session?.name,
      });

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

    socket.on("add-user-room", ({ rooms, userID, users, enterUserName }) => {
      console.log("< ADD USER ROOM > ", rooms, userID, users, enterUserName);
      socket.id !== userID && toast.info(`${enterUserName} entrou`);

      setUsersRoom([...users]);
    });

    /** create tag names */
    socket.on(
      "add-id-session-from-another-socket",
      ({ userID, sessionID, roomName, sessionUsers }) => {
        console.log(
          "< ADD ID SESSION FOR TAG NAME > ",
          userID,
          sessionID,
          roomName,
          sessionUsers
        );

        /** create a tag name */
        for (const userKey in sessionUsers) {
          const { sessionID, name } = sessionUsers[userKey];

          let checkElement = document.getElementById(
            `attendant-name-${sessionID}`
          );

          if (!checkElement) {
            console.log("< IF checkElement > ", sessionID, name, checkElement);
            let divName = document.createElement("div");
            divName.setAttribute("id", `attendant-name-${sessionID}`);
            divName.setAttribute("class", `animated fadeIn attendant-name`);
            divName.innerHTML = `${name}`;
            document
              .getElementById(`box-attendant-${sessionID}`)
              .appendChild(divName);
          } else {
            let element = document.getElementById(
              `attendant-name-${sessionID}`
            );
            element.innerHTML = `${name}`;

            console.log("< ELSE checkElement > ", sessionID, name, element);
          }

          // if (checkElement && ) {

          // }
        }
        // if (window.userIdLocal) {
        //   const _findUserName = () => {
        //     if (users.length <= 0) return "---";
        //     const user = users.find((item) => item?.userID === socket?.id);
        //     console.log("< USRNAME ON TAG > ", users);
        //     // return user?.name;
        //   };
        // let divName = document.createElement("div");
        // divName.setAttribute("class", "animated fadeIn attendant-name");
        // divName.innerHTML = `${_findUserName()}`;
        // document
        //   .getElementById(`box-attendant-${window.userIdLocal}`)
        //   .appendChild(divName);
        // }
        /** end create a tag name */
      }
    );

    socket.on("remove-user-room", ({ rooms, leftUser, remainingUsers }) => {
      console.log("< REMOVE USER FROM ROOM > ", rooms, leftUser);
      toast.warn(`${leftUser?.name} saiu`);
      setUsersRoom([...remainingUsers]);
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

  if (session?.isLoading) return <Loading text="Loading..." />;

  return (
    <Channel
      socket={state.socket}
      roomCreatorID={roomCreator}
      usersRoom={usersRoom}
      session={session}
    />
  );
};

export default Room;
