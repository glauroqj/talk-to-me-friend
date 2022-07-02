import React from "react";
import PropTypes from "prop-types";
/** style */
import * as El from "./Loading.style";
/** components */
import CircularProgress from "@mui/material/CircularProgress";

const Loading = ({ text, color }) => (
  <El.LoadingContainer>
    <CircularProgress color={color} />
    {text}
  </El.LoadingContainer>
);

Loading.defaultProps = {
  text: "",
  color: "primary",
};

Loading.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
};

export default Loading;
