import { Box } from "@mui/material";
import React from "react";
import './Loading.css'

const Loading = ({color}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        paddingTop: "200px",
      }}
    >
      <div id="page">
        <div id="container">
          <div id="ring"></div>
          <div id="ring"></div>
          <div id="ring"></div>
          <div id="ring"></div>
          <div id="h3" style={{color:{color}}} >Fetching Data...</div>
        </div>
      </div>
    </Box>
  );
};

export default Loading;
