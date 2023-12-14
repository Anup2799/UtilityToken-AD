import React from "react";
import Layout from "../../components/Layout/Layout";
import { Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotUser = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Container
        sx={{
          pt: 5,
        }}
      >
        <Typography gutterBottom variant="h5" textAlign={"center"}>
          To access this service you should optin as Privilege user, Please
          click on below button
        </Typography>
        <Stack gap={2} direction={"row"} justifyContent={"center"}>
          <Button sx={{}} variant="outlined" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button
            sx={{}}
            variant="contained"
            onClick={() => navigate("/request-service")}
          >
            become a Privilege user
          </Button>
        </Stack>
      </Container>
    </Layout>
  );
};

export default NotUser;
