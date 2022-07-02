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
} from "@mui/material";

const Home = () => {
  const [state, setState] = useState({
    value: "",
    roomName: "",
  });

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
        <Grid item xs={12}>
          <FormControl>
            <InputLabel htmlFor="my-input">Your name</InputLabel>
            <Input
              id="my-input"
              aria-describedby="my-helper-text"
              value={state.value}
              onChange={(e) => setState({ ...state, value: e.target.value })}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl>
            <InputLabel htmlFor="my-input">Chat room name</InputLabel>
            <Input
              id="my-input"
              aria-describedby="my-helper-text"
              value={state.roomName}
              onChange={(e) => setState({ ...state, roomName: e.target.value })}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Link to={`/room/${state.roomName}`}>
            <Button variant="contained" color="primary" fullWidth>
              Create Room
            </Button>
          </Link>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
