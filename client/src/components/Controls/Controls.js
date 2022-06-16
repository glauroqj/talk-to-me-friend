import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/** style */
import * as El from "./Controls.style";
/** components */
import {
  BottomNavigation,
  BottomNavigationAction,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
/** icons */
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";

import ChatIcon from "@material-ui/icons/Chat";
import CallEndIcon from "@material-ui/icons/CallEnd";

import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";

import SendIcon from "@material-ui/icons/Send";
import PersonIcon from "@material-ui/icons/Person";

const messagesArray = [];

const Controls = ({ socket, users }) => {
  const [micState, setMicState] = useState({
    status: true,
    title: "Mute",
  });
  const [camState, setCamState] = useState({
    status: true,
    title: "Camera",
  });
  const [chatState, setChatState] = useState({
    status: false,
    messageText: "",
  });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket?.connected) {
      console.log("< SOCKET CONTROLS > ", socket);
      socket.on("chat-message", (payloadMsg) => {
        console.log("< RECEIVING MESSAGE > ", payloadMsg, chatState);
        messagesArray.unshift(payloadMsg);
        setMessages([...messages, payloadMsg]);
      });
    }
  }, [socket]);

  const handleBarClick = (type) => {
    const { connection, userIdLocal } = window;

    const options = {
      chat: () => {
        setChatState({
          ...chatState,
          status: !chatState.status,
        });
      },
      mic: () => {
        micState.status
          ? connection.streamEvents[userIdLocal].stream.mute("audio")
          : connection.streamEvents[userIdLocal].stream.unmute("audio");
        setMicState({
          ...micState,
          status: !micState.status,
        });
        connection.streamEvents[window.userIdLocal].mediaElement.muted = true;
      },
      cam: () => {
        camState.status
          ? connection.streamEvents[userIdLocal].stream.mute("video")
          : connection.streamEvents[userIdLocal].stream.unmute("video");
        setCamState({
          ...micState,
          status: !camState.status,
        });
      },
      end: () => {
        window.location.href = "https://google.com";
      },
    };

    if (typeof options[type] === "function" && userIdLocal) options[type]();
  };

  return (
    <>
      <El.ControlsContainer>
        <BottomNavigation showLabels>
          <BottomNavigationAction
            disabled={true}
            label={`${users.length}`}
            icon={<PersonIcon />}
          />
          <BottomNavigationAction
            onClick={() => handleBarClick("mic")}
            label="Mute"
            icon={micState.status ? <MicIcon /> : <MicOffIcon />}
          />
          <BottomNavigationAction
            onClick={() => handleBarClick("cam")}
            label="Cam"
            icon={camState.status ? <VideocamIcon /> : <VideocamOffIcon />}
          />
          <BottomNavigationAction
            onClick={() => handleBarClick("end")}
            label="End"
            icon={<CallEndIcon />}
          />
          <BottomNavigationAction
            onClick={() => handleBarClick("chat")}
            label="Chat"
            icon={<ChatIcon />}
          />
        </BottomNavigation>
      </El.ControlsContainer>

      {chatState.status && (
        <El.ChatContainer>
          <El.ControlsChat>
            <ul>
              {messagesArray.length > 0 &&
                messagesArray.map((item) => (
                  <li>
                    <label>{item.userId}</label>
                    <div>{item.msg}</div>
                  </li>
                ))}
            </ul>
            <form
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  /** send to socket here */
                  setChatState({ ...chatState, messageText: "" });
                  socket &&
                    socket.emit(
                      "chat-message",
                      socket.id,
                      String(window.location.pathname),
                      `${chatState.messageText}`
                    );
                }
              }}
            >
              <FormControl variant="outlined" className="form-message">
                <InputLabel htmlFor="outlined-adornment-password">
                  Mensagem
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={"text"}
                  autoFocus
                  value={chatState.messageText}
                  onChange={(e) =>
                    setChatState({ ...chatState, messageText: e.target.value })
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          if (chatState.message === "") return false;
                          /** send to socket here */
                          setChatState({ ...chatState, messageText: "" });
                          socket &&
                            socket.emit(
                              "chat-message",
                              socket.id,
                              String(window.location.pathname),
                              `${chatState.messageText}`
                            );
                        }}
                        edge="end"
                      >
                        {<SendIcon />}
                        {/* {values.showPassword ? <Visibility /> : <VisibilityOff />} */}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={90}
                />
              </FormControl>
            </form>
          </El.ControlsChat>
        </El.ChatContainer>
      )}
    </>
  );
};

Controls.propTypes = {
  socket: PropTypes.object,
  users: PropTypes.array,
};

export default Controls;
