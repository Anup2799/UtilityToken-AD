import { Box } from "@mui/material";
import React from "react";

const Layout = (props) => {
  return (
    <React.Fragment>
      <Box
        sx={{
          marginTop: "105px",
        }}
      >
        {props.children}
      </Box>
    </React.Fragment>
  );
};

export default Layout;
