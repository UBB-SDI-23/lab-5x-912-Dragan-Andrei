import { createTheme } from "@mui/material";

// change material UI theme
export const theme = createTheme({
  palette: {
    primary: {
      main: "#be9063",
    },
  },
  typography: {
    fontFamily: ["Quattrocento Sans", "Oswald"].join(","),

    h1: {
      fontFamily: "Oswald",
      fontSize: "64px",
      color: "#333333",
    },

    h2: {
      fontFamily: "Oswald",
      fontSize: "40px",
      color: "#333333",
    },

    h3: {
      fontFamily: "Quattrocento Sans",
      fontSize: "24px",
      fontWeight: "bold",
      letterSpacing: "1px",
      color: "#be9063",
    },

    h4: {
      fontFamily: "Quattrocento Sans",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333333",
    },

    h5: {
      fontFamily: "Quattrocento Sans",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333333",
      lineHeight: "1",
    },

    h6: {
      fontFamily: "Quattrocento Sans",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333333",
      lineHeight: "1",
    },

    body1: {
      fontFamily: "Quattrocento Sans",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#3d3c3a",
      lineHeight: "1",
    },

    body2: {
      // for errors
      fontFamily: "Quattrocento Sans",
      fontSize: "16px",
      fontWeight: "semibold",
      color: "#be9063",
      lineHeight: "1",
    },
  },
});
