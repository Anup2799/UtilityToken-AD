import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

const defaultTheme = createTheme();

export default function ThemeWrapper(props) {
  //   const theme = useTheme();
  // const colorMode = React.useContext(ColorModeContext);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
