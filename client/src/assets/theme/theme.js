import { createTheme } from "@mui/material/styles";

const Breakpoints = {
  xs: "640px",
  sm: "830px",
  md: "1100px",
  lg: "1500px",
};

const Colors = {
  c_main_light: "#7AB8E1",
  c_main: "#3498db",
  c_main_dark: "#2980b9",
  c_secondary_light: "#E1B67A",
  c_secondary: "#DB9735",
  c_secondary_dark: "#C2842F",
  c_light: "#ffffff",
  c_gray: "#eeeeee",
};

const Spaces = {
  0: "0",
  4: "4px",
  8: "8px",
  16: "16px",
  24: "24px",
  32: "32px",
  40: "40px",
  48: "48px",
};

const Fonts = {
  default: "Roboto, sans-serif",
};

const FontSize = {
  12: "12px",
  14: "14px",
  16: "16px",
  18: "18px",
  24: "24px",
  32: "32px",
};

const FontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  bold: 700,
};

export const ThemeMaterialUI = createTheme({
  palette: {
    type: "light",
    primary: {
      light: Colors.c_main_light,
      main: Colors.c_main,
      dark: Colors.c_main_dark,
    },
    secondary: {
      light: Colors.c_secondary_light,
      main: Colors.c_secondary,
      dark: Colors.c_secondary_dark,
    },
  },
});

/** THEME */
export const Theme = {
  space: Spaces,
  breakpoint: Breakpoints,
  color: Colors,
  typography: {
    fontFamily: Fonts,
    fontSize: FontSize,
    fontWeight: FontWeight,
  },
};
