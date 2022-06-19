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

const Channel = ({ socket }) => {
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
    getClientConnection();
  }, [socket]);

  const getClientConnection = () => {
    if (!socket?.connected) return false;
    console.log("< CHANNEL - SOCKET > ", socket);
    const { id } = socket;
    let checkElement = document.getElementById(`attendant-${id}`);
    let myVideoStream;
    let myVideo = document.createElement("video");
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
    socket.on("webrtc_offer", async (event) => {
      console.log("Socket event callback: webrtc_offer");

      rtcPeerConnection = new RTCPeerConnection(iceServers);
      _helperAddLocalTracks(rtcPeerConnection, myVideoStream);
      rtcPeerConnection.ontrack = _helperSetRemoteStream;
      rtcPeerConnection.onicecandidate = _helperSendIceCandidate;
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
      // await _helperHandleOfferAnswer(rtcPeerConnection);
    });

    socket.on("webrtc_answer", (event) => {
      console.log("Socket event callback: webrtc_answer ", event);

      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
    });

    socket.on("webrtc_ice_candidate", (event) => {
      console.log("Socket event callback: webrtc_ice_candidate ", event);

      // ICE candidate configuration.
      let candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      });
      rtcPeerConnection.addIceCandidate(candidate);
    });

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

    const _addVideoStream = (video, stream) => {
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", async () => {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        _helperAddLocalTracks(rtcPeerConnection, myVideoStream);
        rtcPeerConnection.ontrack = _helperSetRemoteStream;
        rtcPeerConnection.onicecandidate = _helperSendIceCandidate;
        await _helperHandleOfferAnswer(rtcPeerConnection);
        /** end connect */
        video.play();
        // myVideo.append(video);
        document.getElementById("attendants").appendChild(video);
      });
    };
  };

  /** HELPER FUNCTIONS */
  const _helperAddLocalTracks = (rtcPeerConnection, myVideoStream) => {
    myVideoStream.getTracks().forEach((track) => {
      console.log("< _helperAddLocalTracks > ", track);
      rtcPeerConnection.addTrack(track, myVideoStream);
    });
  };

  const _helperSetRemoteStream = (event) => {
    console.log("< _helperSetRemoteStream > ", event);
    // let remoteVideo = document.createElement("video");
    // remoteVideo.muted = true;
    // remoteVideo.srcObject = event.streams[0]
  };

  const _helperSendIceCandidate = (event) => {
    console.log("< _helperSendIceCandidate > ", event);
    if (event.candidate) {
      socket.emit("webrtc_ice_candidate", {
        roomId: String(window?.location?.pathname),
        label: event?.candidate?.sdpMLineIndex,
        candidate: event?.candidate?.candidate,
      });
    }
  };

  const _helperHandleOfferAnswer = (rtcPeerConnection) => {
    const { pendingRemoteDescription } = rtcPeerConnection;
    console.log("< _helperHandleOfferAnswer > ", rtcPeerConnection);
    if (!pendingRemoteDescription) {
      _helperCreateOffer(rtcPeerConnection);
      console.log("< create offer >");
    } else {
      _helperCreateAnswer(rtcPeerConnection);
      console.log("< create answer >");
    }
  };

  const _helperCreateOffer = async (rtcPeerConnection) => {
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createOffer();
      rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (error) {
      console.error(error);
    }
    console.log(
      "< _helperCreateOffer > ",
      sessionDescription,
      rtcPeerConnection
    );
    socket.emit("webrtc_offer", {
      roomId: String(window?.location?.pathname),
      sdp: sessionDescription,
      userID: socket?.id,
    });
  };

  const _helperCreateAnswer = async (rtcPeerConnection) => {
    let sessionDescription;
    try {
      sessionDescription = await rtcPeerConnection.createAnswer();
      rtcPeerConnection.setLocalDescription(sessionDescription);
    } catch (error) {
      console.error(error);
    }

    socket.emit("webrtc_answer", {
      roomId: String(window?.location?.pathname),
      sdp: sessionDescription,
      userID: socket?.id,
    });
  };
  /** END HELPER FUNCTIONS */

  // const handleConnection = async () => {
  //   if (!isRTCLoaded || !isIOLoaded) return false;
  //   console.log("< CHECK LIB > ", isRTCLoaded, isIOLoaded);

  //   const RTCMultiConnection = window.RTCMultiConnection;
  //   const connection = new RTCMultiConnection();
  //   connection.socketURL = "https://rtcmulticonnection.herokuapp.com:443/";
  //   connection.session = {
  //     audio: true,
  //     video: true,
  //   };
  //   connection.sdpConstraints.mandatory = {
  //     OfferToReceiveAudio: true,
  //     OfferToReceiveVideo: true,
  //   };
  //   connection.mediaConstraints = {
  //     video: {
  //       width: { ideal: 1280 },
  //       height: { ideal: 720 },
  //       frameRate: 30,
  //     },
  //     audio: true,
  //   };
  //   connection.iceServers = [
  //     {
  //       urls: [
  //         "stun:stun.l.google.com:19302",
  //         "stun:stun1.l.google.com:19302",
  //         "stun:stun2.l.google.com:19302",
  //         "stun:stun.l.google.com:19302?transport=udp",
  //       ],
  //     },
  //   ];

  //   connection.onstream = (event) => {
  //     console.log("< ON STREAM > ", event);

  //     let checkElement = document.getElementById(`attendant-${event.streamid}`);

  //     if (checkElement) {
  //       /** duplicated element */
  //       checkElement.remove();
  //     }

  //     event.mediaElement.removeAttribute("src");
  //     event.mediaElement.removeAttribute("srcObject");
  //     event.mediaElement.muted = true;
  //     event.mediaElement.volume = 0;

  //     let video = document.createElement("video");
  //     video.setAttribute("id", `attendant-${event.streamid}`);
  //     video.setAttribute("class", "animated fadeIn");

  //     try {
  //       video.setAttributeNode(document.createAttribute("autoplay"));
  //       video.setAttributeNode(document.createAttribute("playsinline"));
  //     } catch (e) {
  //       video.setAttribute("autoplay", true);
  //       video.setAttribute("playsinline", true);
  //     }

  //     if (event.type === "local") {
  //       window.userIdLocal = event.streamid;
  //       video.volume = 0;

  //       try {
  //         video.setAttributeNode(document.createAttribute("muted"));
  //       } catch (e) {
  //         video.setAttribute("muted", true);
  //       }
  //     }

  //     document.getElementById("attendants").appendChild(video);

  //     /** update users */
  //     const userArrays = connection.streamEvents.selectAll();
  //     setUsers(userArrays);

  //     setTimeout(() => {
  //       setIsLoading(false);
  //       video.srcObject = event.stream;
  //     }, 300);
  //   };

  //   connection.onstreamended = (event) => {
  //     let checkElement = document.getElementById(`attendant-${event.streamid}`);
  //     if (checkElement) {
  //       checkElement.remove();

  //       /** update users */
  //       setTimeout(() => {
  //         toast.warn(`${event.streamid} saiu`);
  //         const userArrays = connection.streamEvents.selectAll();
  //         setUsers(userArrays);
  //       }, 500);
  //     }
  //   };

  //   connection.onMediaError = (e) => {
  //     console.warn("< ERROR > ", e);
  //     if (e.message === "Concurrent mic process limit.") {
  //       connection.join(connection.sessionid);
  //     }
  //   };

  //   connection.openOrJoin(window.location.pathname);
  //   console.log("< connection > ", connection);
  //   window.connection = connection;
  // };

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
};

export default Channel;

/*
https://rtcmulticonnection.herokuapp.com/demos/

https://muazkhan.com:9001/demos/

https://www.rtcmulticonnection.org/docs/getting-started/

*/
