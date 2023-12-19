import React from "react";
import { Box, Grid, Typography } from "@mui/material";

const Footer = () => {
  return (
    <React.Fragment>
      <Box
        sx={{
          bgcolor: "#023047",
          color: "white",
        }}
      >
        <Grid container spacing={2} padding={2} color={"white"}>
          <Grid item xs={12} md={12} sm={12} lg={12}>
            {/* Remove or comment out the Divider */}
            {/* <Divider /> */}
            <Typography
              textAlign={"center"}
              gutterBottom
              variant="h5"
              paddingTop={"20px"}
            >
              © Developed by Zenlabs 2023
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Footer;
