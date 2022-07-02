import React from "react";
import ReactDOM from "react-dom";
/** routes */
import RoutesApp from "./routes/RoutesApp";
/** notification */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
/** style */
import { ThemeProvider as ThemeProviderMaterialUI } from "@mui/material/styles";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, Theme, ThemeMaterialUI } from "assets/theme";

// ReactDOM.render(
//   <React.StrictMode>
//     <CssBaseline />
//     <ToastContainer position="top-right" autoClose={4000} pauseOnHover />
//     <RoutesApp />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

const appTree = (
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProviderMaterialUI theme={ThemeMaterialUI}>
      <ThemeProvider theme={Theme}>
        <ToastContainer position="top-right" autoClose={4000} pauseOnHover />
        <RoutesApp />
      </ThemeProvider>
    </ThemeProviderMaterialUI>
  </React.StrictMode>
);

ReactDOM.render(appTree, document.getElementById("root"));
