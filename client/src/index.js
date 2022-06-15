import React from "react";
import ReactDOM from "react-dom";
/** routes */
import RoutesApp from "./routes/RoutesApp";
/** reset css */
import { CssBaseline } from "@material-ui/core";
/** notification */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ToastContainer position="top-right" autoClose={4000} pauseOnHover />
    <RoutesApp />
  </React.StrictMode>,
  document.getElementById("root")
);
