import React, { useState } from "react";
import { Link } from "react-router-dom";
/** ui */
import {
  Container,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
  TextField,
} from "@mui/material";

const Home = () => {
  const [state, setState] = useState({
    userName: "",
    roomName: "",
  });

  const handleKeys = (e) => {
    const keyActions = {
      13: () => {
        // enter
        handleSubmit();
        e.preventDefault();
      },
    };
    const callKeyActions = keyActions[e?.keyCode];
    if (typeof callKeyActions === "function") callKeyActions();
  };

  const handleSubmit = () => {
    console.log("< handle > ", state);
    const _formatRoomName = () => {};
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Talk to your Friend
        </Typography>
        <Typography component="h4">Create your room</Typography>

        <Box component="form" onKeyDown={handleKeys} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Your Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={state.userName}
            onChange={(e) => setState({ ...state, userName: e.target.value })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Chat room name"
            value={state.roomName}
            onChange={(e) => setState({ ...state, roomName: e.target.value })}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={!state.userName || !state.roomName}
            sx={{ mt: 3, mb: 2 }}
          >
            Create Room
          </Button>
          {/* <Link to={`/room/${state.roomName}`}></Link> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
