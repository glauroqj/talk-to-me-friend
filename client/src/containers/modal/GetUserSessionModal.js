/* eslint-disable */
import { useState } from "react";
import PropTypes from "prop-types";
/** components */
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const GetUserSessionModal = ({ isOpen, send }) => {
  const [state, setState] = useState({
    name: "",
    image: "",
  });

  return (
    <Dialog open={isOpen} sx={{ m: 0, p: 2 }} maxWidth={"xs"} fullWidth>
      <DialogTitle>Before you go in!</DialogTitle>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "left",
          padding: "4px 24px",
        }}
      >
        <Typography component="h5">
          Please, tell us your name. It's just for exhibition
        </Typography>
      </Box>
      <Box
        component="form"
        mt={2}
        sx={{
          p: 2,
          display: "flex",
          flexFlow: "column",
        }}
        onKeyDown={(e) => {
          if (e?.keyCode === 13 && state?.name !== "") {
            e.preventDefault();
            send(state);
          }
        }}
      >
        <Box
          sx={{
            mb: 2,
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            type={"text"}
            autoComplete="name"
            fullWidth
            autoFocus
            required
            value={state?.name}
            onChange={(e) => setState({ ...state, name: e?.target.value })}
            inputProps={{ maxLength: 30 }}
          />
        </Box>
        <Box
          sx={{
            mb: 2,
          }}
        >
          <Button
            size="small"
            fullWidth
            color={"primary"}
            variant="contained"
            onClick={() => send(state)}
            disabled={state?.name === ""}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

GetUserSessionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  send: PropTypes.func.isRequired,
};

export default GetUserSessionModal;
