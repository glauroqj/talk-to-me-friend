import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
/** utils */
import debounce from "utils/debounce";

const Home = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    userName: "",
    roomName: "",
  });

  const [formattedUrl, setFormattedUrl] = useState("");

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

  const formatRoomName = useCallback(
    debounce((value) => {
      const finalUrl = value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      setFormattedUrl(finalUrl);
    }, 300)
  );

  const handleSubmit = () => {
    console.log("< handle > ", state);
    navigate(`room/${formattedUrl}`, { replace: true });
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
            inputProps={{ maxLength: 40 }}
            onChange={(e) => setState({ ...state, userName: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Chat room name"
            value={state.roomName}
            inputProps={{ maxLength: 40 }}
            onChange={(e) => {
              if (e.target.value && e.target.value.length >= 0) {
                formatRoomName(e.target.value);
              }
              setState({ ...state, roomName: e.target.value });
            }}
          />

          {state.roomName.length > 0 && (
            <TextField disabled value={formattedUrl} />
          )}

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
