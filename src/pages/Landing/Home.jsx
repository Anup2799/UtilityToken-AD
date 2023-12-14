import React, { useEffect } from "react";
import styles from "./Landing.module.css";
 
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Footer from "../../components/Footer";
 
import background from "../../components/assets/bg.svg";
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
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          height: "100vh",
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
            color={"white"}
            className="animate__animated animate__fadeInDown"
          >
            Welcome to Utility token Hotel hospitality Web3 Demo. Please select a persona to continue
          </Typography>
          <Grid
            rowGap={3}
            columnGap={5}
            sx={{
              pt: 2,
              display: {
                md: "flex",
                lg: "flex",
                xl: "flex",
              },
              justifyContent: {
                md: "center",
                lg: "center",
                xl: "center",
              },
            }}
          >
            <Grid
              display={"flex"}
              justifyContent={"center"}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              mb={{
                xs: 2,
                sm: 2,
                md: 4,
                xl: 4,
                lg: 4,
              }}
            >
              <Card
                onClick={() => setSelectedRoute("admin")}
                sx={{
                  width: "160px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  borderRadius: 4,
                  backgroundColor:
                    selectedRoute === "admin" ? "lightsalmon" : "",
                  color: selectedRoute === "admin" ? "white" : "black",
                }}
              >
                <CardMedia
                  component="img"
                  height="auto"
                  image={adminImage}
                  alt="Admin Image"
                />
                <CardContent>
                  <Typography variant="body2" align="center" fontWeight="bold">
                    <strong>Services Manager</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              display={"flex"}
              justifyContent={"center"}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              xl={3}
              mb={{
                xs: 2,
                sm: 2,
                md: 4,
                xl: 4,
                lg: 4,
              }}
            >
              <Card
                onClick={() => setSelectedRoute("customer")}
                sx={{
                  width: "160px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                  borderRadius: 4,
                  backgroundColor:
                    selectedRoute === "customer" ? "lightsalmon" : "",
                  color: selectedRoute === "customer" ? "white" : "black",
                }}
              >
                <CardMedia
                  component="img"
                  height="auto"
                  image={customerImage}
                  alt="Customer Image"
                />
                <CardContent>
                  <Typography variant="body2" align="center" fontWeight="bold">
                    <strong>Customer</strong>
                  </Typography>
                </CardContent>
              </Card>
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