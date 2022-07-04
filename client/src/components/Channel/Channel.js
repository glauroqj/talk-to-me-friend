import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/** style */
import * as El from "./Channels.style";
/** components */
import Loading from "components/Loading/Loading";
import Controls from "components/Controls/Controls";
import { Button } from "@mui/material";
// /** notification */
// import { toast } from "react-toastify";

window.connection = {};
window.userIdLocal = null;

const Channel = ({ socket, roomCreatorID, usersRoom }) => {
  let checkAgain = null;

  const [isLoading, setIsLoading] = useState(true);
  // const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // if (socket?.connected) {
    //   console.log("< SOCKET CONNECTED > ", socket);
    //   handleConnection();
    // }
    // if (socket?.disconnected) {
    //   console.log("< SOCKET NOT CONNECTED > ", socket);
    //   setError(true);
    //   setIsLoading(false);
    // }
    if (roomCreatorID) {
      // getClientConnection();
      handleConnection();
    }
  }, [socket, roomCreatorID]);

  const handleConnection = async () => {
    const isRTCLoaded = await externalLibIsLoaded("rtc");
    const isIOLoaded = await externalLibIsLoaded("io");
    console.log("< CHECK LIB > ", isRTCLoaded, isIOLoaded);
    if (!isRTCLoaded || !isIOLoaded) return false;

    const RTCMultiConnection = window.RTCMultiConnection;
    const connection = new RTCMultiConnection();

    connection.socketURL = "https://muazkhan.com:9001/";

    connection.session = {
      audio: true,
      video: true,
    };
    connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
    };
    connection.mediaConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: 30,
      },
      audio: true,
    };
    connection.iceServers = [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun.l.google.com:19302?transport=udp",
        ],
      },
    ];

    connection.onstream = (event) => {
      console.log("< ON STREAM > ", event);

      let checkElement = document.getElementById(`attendant-${event.streamid}`);

      if (checkElement) {
        /** duplicated element */
        checkElement.remove();
      }

      event.mediaElement.removeAttribute("src");
      event.mediaElement.removeAttribute("srcObject");
      event.mediaElement.muted = true;
      event.mediaElement.volume = 0;

      /** create a box for video first */
      let boxVideo = document.createElement("div");
      boxVideo.setAttribute("id", `box-attendant-${event.streamid}`);
      boxVideo.setAttribute("class", "animated fadeIn box-attendant");
      document.getElementById("attendants").appendChild(boxVideo);
      /** end create a box for video first */

      /** create a tag name */
      // if (window.userIdLocal) {
      //   const _findUserName = () => {
      //     if (users.length <= 0) return "---";
      //     const user = users.find((item) => item?.userID === socket?.id);
      //     console.log("< USRNAME ON TAG > ", users);
      //     // return user?.name;
      //   };
      //   let divName = document.createElement("div");
      //   divName.setAttribute("class", "animated fadeIn attendant-name");
      //   divName.innerHTML = `${_findUserName()}`;
      //   document
      //     .getElementById(`box-attendant-${window.userIdLocal}`)
      //     .appendChild(divName);
      // }
      /** end create a tag name */

      let video = document.createElement("video");
      video.setAttribute("id", `attendant-${event.streamid}`);
      video.setAttribute("class", "animated fadeIn");

      try {
        video.setAttributeNode(document.createAttribute("autoplay"));
        video.setAttributeNode(document.createAttribute("playsinline"));
      } catch (e) {
        video.setAttribute("autoplay", true);
        video.setAttribute("playsinline", true);
      }

      if (event.type === "local") {
        window.userIdLocal = event?.streamid;
        video.volume = 0;

        try {
          video.setAttributeNode(document.createAttribute("muted"));
        } catch (e) {
          video.setAttribute("muted", true);
        }
      }

      document
        .getElementById(`box-attendant-${event.streamid}`)
        .appendChild(video);
      // document.getElementById("attendants").appendChild(video);

      /** update users */
      // const userArrays = connection.streamEvents.selectAll();
      // setUsers(userArrays);

      setTimeout(() => {
        setIsLoading(false);
        video.srcObject = event.stream;
      }, 300);
    };

    connection.onstreamended = (event) => {
      let checkElement = document.getElementById(`attendant-${event.streamid}`);
      if (checkElement) {
        checkElement.remove();

        /** update users */
        // setTimeout(() => {
        //   toast.warn(`${event.streamid} saiu`);
        //   const userArrays = connection.streamEvents.selectAll();
        //   setUsers(userArrays);
        // }, 300);
      }
    };

    connection.onMediaError = (e) => {
      console.warn("< ERROR > ", e);
      if (e.message === "Concurrent mic process limit.") {
        connection.join(connection.sessionid);
      }
    };

    connection.openOrJoin(window.location.pathname);
    console.log("< connection > ", connection);
    window.connection = connection;
  };

  const externalLibIsLoaded = (name) =>
    new Promise((resolve) => {
      // const isArrayEmpty = Object.keys( window.externalLib ).length
      console.log("< external name > ", name);
      if (window.externalLib[name]) resolve(true);

      if (!window.externalLib[name]) {
        let count = 0;
        checkAgain = setInterval(() => {
          if (!window.externalLib[name] && count >= 5) {
            clearInterval(checkAgain);
            resolve(false);
          }

          if (window.externalLib[name]) {
            clearInterval(checkAgain);
            resolve(true);
          }

          count++;
        }, 1000);
      }
    });

  const canRenderControls = () => {
    if (usersRoom.length <= 0) return false;
    const check = usersRoom.find((item) => item.userID === socket.id);
    return check ? <Controls socket={socket} users={usersRoom} /> : false;
    // return <Controls socket={socket} users={usersRoom} />;
  };

  return (
    <El.ChannelContainer>
      {isLoading && (
        <El.ChannelLoading className="animated fadeIn">
          <Loading text="Loading room..." />
        </El.ChannelLoading>
      )}

      {error && (
        <El.ChannelError className="animated fadeIn">
          <h4>Something got wrong, reload page, please!</h4>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </El.ChannelError>
      )}

      <El.ChannelAttendants id="attendants" />

      {socket?.connected && canRenderControls()}
    </El.ChannelContainer>
  );
};

Channel.propTypes = {
  socket: PropTypes.object,
  roomCreatorID: PropTypes.string,
  usersRoom: PropTypes.array,
};

export default Channel;

/*
https://rtcmulticonnection.herokuapp.com/demos/

https://muazkhan.com:9001/demos/

https://www.rtcmulticonnection.org/docs/getting-started/

*/
