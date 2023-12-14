import React from "react";
import Layout from "../../components/Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { Typography, Button, Box, Stack, Container } from "@mui/material";

const NotFound = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <Layout>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={400} mt={5} textAlign={"center"}>
          The route was not Found {pathname}
        </Typography>

        <Button
          sx={{
            width: 100,
          }}
          variant="contained"
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </Container>
    </Layout>
  );
};

export default NotFound;
