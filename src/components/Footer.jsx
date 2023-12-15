import {
  Box,
  Grid,
  Stack,
  Typography,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CiFacebook, CiInstagram, CiLinkedin, CiTwitter } from "react-icons/ci";

const Footer = () => {
  //Navigation
  const navigate = useNavigate();
  const features = [
    { pageName: "Stay", navgateTo: "/" },
    { pageName: "Foods & Drinks", navgateTo: "/" },
    { pageName: "Gallery", navgateTo: "/" },
    { pageName: "Enquiry", navgateTo: "/" },
  ];
  const checkAdmin = localStorage.getItem("aUser");
  const actions = ["Resources", "Docs", "Markeplace"];
  const help = [
    { pageName: "Contact US", navgateTo: "/" },
    { pageName: "Help", navgateTo: "/" },
    {
      pageName: "admin",
      navgateTo: checkAdmin === "admin" ? "/admin" : "/auth/admin",
    },
  ];
  return (
    <React.Fragment>
      <Box
        sx={{
          bgcolor: "#023047",
          color: "white",
          // mt: 3,
        }}
      >
        {/* <Container> */}
        <Grid container spacing={2} padding={2} color={"white"}>
          <Grid item xs={12} lg={6}>
            <Grid item>
              <Box>
                <Typography gutterBottom variant="h4">
                Utility Token Resort Storage
                </Typography>
                <Stack direction={"row"}>
                  <Tooltip title="Facebook">
                    <IconButton>
                      <CiFacebook style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Instagram">
                    <IconButton>
                      <CiInstagram style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Instagram">
                    <IconButton>
                      <CiLinkedin style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Instagram">
                    <IconButton>
                      <CiTwitter style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid container>
              <Grid item xs={4}>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "19px",
                    }}
                  >
                    Features
                  </Typography>
                  {features.map((item) => {
                    return (
                      <Typography
                        key={item.pageName}
                        sx={{
                          textDecoration: "underline",
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => navigate(item.navgateTo)}
                      >
                        {item.pageName}
                      </Typography>
                    );
                  })}
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    fontSize: "19px",
                  }}
                >
                  Actions
                </Typography>
                {actions.map((item) => {
                  return (
                    <Typography
                      key={item}
                      sx={{
                        textDecoration: "underline",
                      }}
                    >
                      {item}
                    </Typography>
                  );
                })}
              </Grid>
              <Grid item xs={4}>
                <Typography
                  sx={{
                    fontSize: "19px",
                  }}
                >
                  Help
                </Typography>
                {help.map((item) => {
                  return (
                    <NavLink
                      style={{
                        textDecoration: "none",
                        color: "white",
                      }}
                      key={item.pageName}
                      to={item.navgateTo}
                    >
                      <Typography
                        sx={{
                          textDecoration: "underline",
                        }}
                      >
                        {item.pageName}
                      </Typography>
                    </NavLink>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} sm={12} lg={12}>
            <Divider />
            <Typography
              textAlign={"center"}
              gutterBottom
              variant="h5"
              // color="primary.light"
              paddingTop={"20px"}
            >
              Developed by Zenlabs 2023
            </Typography>
          </Grid>
        </Grid>
        {/* </Container> */}
      </Box>
    </React.Fragment>
  );
};

export default Footer;
