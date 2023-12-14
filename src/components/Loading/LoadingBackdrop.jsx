import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const LoadingBackdrop = ({ state, description }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
      open={state}
    >
      <CircularProgress color="inherit" />
      {description}
    </Backdrop>
  );
};

export default LoadingBackdrop;
