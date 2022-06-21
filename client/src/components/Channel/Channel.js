import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/** style */
import * as El from "./Channels.style";
/** components */
import Loading from "components/Loading/Loading";
import Controls from "components/Controls/Controls";
import { Button } from "@material-ui/core";
/** notification */
import { toast } from "react-toastify";

window.connection = {};
window.userIdLocal = null;

const Channel = ({ socket, roomCreatorID }) => {
  let checkAgain = null;

  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
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

  const getClientConnection = () => {
    if (!socket?.connected) return false;
    console.log("< CHANNEL - SOCKET > ", socket);
    const { id } = socket;
    let checkElement = document.getElementById(`attendant-${id}`);
    let myVideoStream;
    let myVideo = document.createElement("video");
    // myVideo.setAttribute("id", `attendant-${id}`);
    let rtcPeerConnection;
    const iceServers = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
      ],
    };

    /** ONLY SOCKET CONNECTIONs */
    // socket.on("start_call", async () => {
    //   console.log(
    //     "Socket event callback: start_call ",
    //     socket?.id === roomCreatorID
    //   );

    //   if (socket?.id === roomCreatorID) {
    //     rtcPeerConnection = new RTCPeerConnection(iceServers);
    //     _helperAddLocalTracks(rtcPeerConnection, myVideoStream);
    //     rtcPeerConnection.ontrack = _helperSetRemoteStream;
    //     rtcPeerConnection.onicecandidate = _helperSendIceCandidate;
    //     await _helperCreateOffer(rtcPeerConnection);
    //   }
    // });

    // socket.on("webrtc_offer", async (event) => {
    //   console.log("Socket event callback: webrtc_offer ", event);

    //   if (socket?.id !== roomCreatorID) {
    //     rtcPeerConnection = new RTCPeerConnection(iceServers);
    //     _helperAddLocalTracks(rtcPeerConnection, myVideoStream);
    //     rtcPeerConnection.ontrack = _helperSetRemoteStream;
    //     rtcPeerConnection.onicecandidate = _helperSendIceCandidate;
    //     rtcPeerConnection.setRemoteDescription(
    //       new RTCSessionDescription(event)
    //     );
    //     await _helperCreateAnswer(rtcPeerConnection);
    //   }
    // });

    // socket.on("webrtc_answer", (event) => {
    //   console.log("Socket event callback: webrtc_answer ", event);
    //   rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
    // });

    // socket.on("webrtc_ice_candidate", (event) => {
    //   console.log("Socket event callback: webrtc_ice_candidate ", event);
    //   // ICE candidate configuration.
    //   // let candidate = new RTCIceCandidate({
    //   //   sdpMLineIndex: event.label,
    //   //   candidate: event.candidate,
    //   // });
    //   // rtcPeerConnection.addIceCandidate(candidate);
    // });

    if (checkElement) {
      /** duplicated element */
      checkElement.remove();
    }

    myVideo.muted = true;
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        myVideoStream = stream;
        _addVideoStream(myVideo, stream);
      });
  };

  const _addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      // myVideo.append(video);
      document.getElementById("attendants").appendChild(video);
    });
    // socket.emit("start_call", String(window?.location?.pathname));
  };

  /** HELPER FUNCTIONS */
  const _helperAddLocalTracks = (rtcPeerConnection, myVideoStream) => {
    console.log("< _helperAddLocalTracks > ", myVideoStream);
    myVideoStream.getTracks().forEach((track) => {
      rtcPeerConnection.addTrack(track, myVideoStream);
    });
  };

  const _helperSetRemoteStream = (event) => {
    console.log("< _helperSetRemoteStream > ", event);
    let checkElement = document.getElementById(`attendant-${socket?.id}`);

    if (checkElement) {
      /** duplicated element */
      checkElement.remove();
    }

    let video = document.createElement("video");
    video.setAttribute("id", `attendant-${socket?.id}`);
    video.setAttribute("class", "animated fadeIn");

    try {
      video.setAttributeNode(document.createAttribute("autoplay"));
      video.setAttributeNode(document.createAttribute("playsinline"));
    } catch (e) {
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
    }

    document.getElementById("attendants").appendChild(video);

    video.srcObject = event.streams[0];
    // let remoteVideo = document.createElement("video");
    // remoteVideo.muted = true;
    // remoteVideo.srcObject = event.streams[0]
  };

  const _helperSendIceCandidate = (event) => {
    console.log("< _helperSendIceCandidate > ", event);
    if (event.candidate) {
      socket.emit("webrtc_ice_candidate", {
        ...event,
        roomName: String(window?.location?.pathname),
        label: event?.candidate?.sdpMLineIndex,
        candidate: event?.candidate?.candidate,
      });
    }
  };

  const _helperCreateOffer = async (rtcPeerConnection) => {
    try {
      const sessionDescription = await rtcPeerConnection.createOffer();
      rtcPeerConnection.setLocalDescription(sessionDescription);

      console.log(
        "< _helperCreateOffer > ",
        sessionDescription,
        typeof sessionDescription,
        rtcPeerConnection
      );
      socket.emit("webrtc_offer", {
        roomName: String(window?.location?.pathname),
        sdp: sessionDescription,
        userID: socket?.id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const _helperCreateAnswer = async (rtcPeerConnection) => {
    try {
      const sessionDescription = await rtcPeerConnection.createAnswer();
      rtcPeerConnection.setLocalDescription(sessionDescription);

      console.log(
        "< _helperCreateAnswer > ",
        sessionDescription,
        rtcPeerConnection
      );
      socket.emit("webrtc_answer", {
        roomName: String(window?.location?.pathname),
        sdp: sessionDescription,
        userID: socket?.id,
      });
    } catch (error) {
      console.error(error);
    }
  };
  /** END HELPER FUNCTIONS */

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

      document.getElementById("attendants").appendChild(video);

      /** update users */
      const userArrays = connection.streamEvents.selectAll();
      setUsers(userArrays);

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
        setTimeout(() => {
          toast.warn(`${event.streamid} saiu`);
          const userArrays = connection.streamEvents.selectAll();
          setUsers(userArrays);
        }, 500);
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

      {socket && socket.connected && <Controls socket={socket} users={users} />}
    </El.ChannelContainer>
  );
};

Channel.propTypes = {
  socket: PropTypes.object,
  roomCreatorID: PropTypes.string,
};

export default Channel;

/*
https://rtcmulticonnection.herokuapp.com/demos/

https://muazkhan.com:9001/demos/

https://www.rtcmulticonnection.org/docs/getting-started/

*/
