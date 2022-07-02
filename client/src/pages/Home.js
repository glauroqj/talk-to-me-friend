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
    value: "",
    roomName: "",
  });

  const handleSubmit = () => {
    console.log("< handle >");
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

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Your Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={state.value}
            onChange={(e) => setState({ ...state, value: e.target.value })}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Chat room name"
            value={state.roomName}
            onChange={(e) => setState({ ...state, roomName: e.target.value })}
          />

          <Button variant="contained" color="primary" fullWidth>
            Create Room
          </Button>
          {/* <Link to={`/room/${state.roomName}`}></Link> */}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
