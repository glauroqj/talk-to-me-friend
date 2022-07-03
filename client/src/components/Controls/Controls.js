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
  Divider,
  Badge,
} from "@mui/material";
/** icons */
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

import ChatIcon from "@mui/icons-material/Chat";
import CallEndIcon from "@mui/icons-material/CallEnd";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

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
              {messagesArray?.length > 0 &&
                messagesArray.map((item) => (
                  <li>
                    <Divider />
                    <Badge badgeContent={"Teste"} color="primary" />
                    <label>{item.userId}</label>
                    <div>{item?.message}</div>
                  </li>
                ))}
            </ul>
            <form
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (chatState?.messageText === "") return false;
                  /** send to socket here */
                  setChatState({ ...chatState, messageText: "" });
                  socket &&
                    socket.emit("chat-message", {
                      userID: socket?.id,
                      roomName: String(window.location.pathname),
                      message: `${String(chatState?.messageText)}`,
                    });
                }
              }}
            >
              <FormControl variant="outlined" className="form-message">
                <InputLabel htmlFor="outlined-adornment-password">
                  Message
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
                          if (chatState?.messageText === "") return false;
                          /** send to socket here */
                          setChatState({ ...chatState, messageText: "" });
                          socket &&
                            socket.emit("chat-message", {
                              userID: socket?.id,
                              roomName: String(window.location.pathname),
                              message: `${String(chatState?.messageText)}`,
                            });
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
