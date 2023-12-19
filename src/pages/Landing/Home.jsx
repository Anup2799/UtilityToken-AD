import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Footer from "../../components/Footer";
import adminImage from "../../components/assets/Admin.png";
import customerImage from "../../components/assets/customer.png";
import { useState } from "react";
import { toast } from "react-toastify";

const Home = () => {
  const checkAdmin = localStorage.getItem("aUser");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [selectedRoute, setSelectedRoute] = useState(null);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (selectedRoute === "admin") {
      checkAdmin === "admin" ? navigate("/admin") : navigate("/auth/admin");
    } else if (selectedRoute === "customer") {
      navigate("/customer");
    } else {
      toast("Select persona to continue", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <React.Fragment>
      <Box
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Layout>
          <Typography
            paddingTop={"40px"}
            textAlign={"center"}
            variant="h5"
            p={2}
            color={"black"}
            className="animate__animated animate__fadeInDown"
          >
            Welcome to Utility token Hotel hospitality Web3 Demo. Please select a persona to continue
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              pt: 2,
              justifyContent: "center",
            }}
          >
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={adminImage}
                  alt="Admin"
                  style={{ width: "50%", height: "50%", borderRadius: "8px" }}
                  onClick={() => setSelectedRoute("admin")}
                />
                <Typography
                  variant="body2"
                  align="center"
                  fontWeight="bold"
                  mt={2}
                  color={selectedRoute === "admin" ? "#f6685e" : "black"}
                  fontSize="1.2rem"
                >
                  <strong>Service Manager</strong>
                </Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={customerImage}
                  alt="Customer"
                  style={{ width: "75%", height: "80%", borderRadius: "8px" }}
                  onClick={() => setSelectedRoute("customer")}
                />
                <Typography
                  variant="body2"
                  align="center"
                  fontWeight="bold"
                  mt={2}
                  color={selectedRoute === "customer" ? "#f6685e" : "black"}
                  fontSize="1.2rem"
                >
                  <strong>Customer</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              pb: "20px",
              display: "flex",
              justifyContent: "end",
              gap: "20px",
              paddingRight: "20px",
            }}
          >
            <Button variant="contained" onClick={() => setSelectedRoute(null)}>
              Reset
            </Button>
            <Button variant="contained" onClick={handleProceed}>
              Proceed
            </Button>
          </Box>
        </Layout>
      </Box>
      <Footer />
    </React.Fragment>
  );
};

export default Home;
