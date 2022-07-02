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
    userName: "",
    image: "",
  });

  return (
    <Dialog open={isOpen} sx={{ m: 0, p: 2 }} maxWidth={"xs"} fullWidth>
      <DialogTitle>Informe seus dados</DialogTitle>

      <Box
        component="form"
        mt={2}
        sx={{
          p: 2,
          display: "flex",
          flexFlow: "column",
        }}
        onKeyDown={(e) => {
          e?.keyCode === 13 && (e.preventDefault(), send());
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
            value={state?.userName}
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
            disabled={state?.name === "" || state?.role === "" ? true : false}
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
