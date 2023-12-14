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
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Footer from "../../components/Footer";

import background from "../../components/assets/bg.svg";
//images
import resturant from "../../components/assets/resturant.png";
import ps from "../../components/assets/privilege.png";
const CustomerLandingScreen = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const services = [
    {
      id: 1,
      name: "Standard Services",
      pic: resturant,
      animate: "animate__animated animate__fadeInLeft",
      navigateTo: "/common-services",
    },
    {
      id: 2,
      name: "Privilege Services",
      pic: ps,
      animate: "animate__animated animate__fadeInRight",
      navigateTo: "/privilege-services",
    },
  ];
  return (
    <React.Fragment>
      <Box
        style={{
          backgroundImage: `url(${background})`,
          height: {
            xs: "100vh",
            sm: "100vh",
            md: "85vh",
            lg: "85vh",
            xl: "100vh",
          },
        }}
      >
        <Layout>
          <Typography
            paddingTop={"40px"}
            textAlign={"center"}
            variant="h4"
            p={2}
            color={"white"}
            className="animate__animated animate__fadeInDown"
          >
            Enjoy our services..
          </Typography>
          <Grid
            //container
            rowGap={3}
            columnGap={5}
            sx={{
              display: {
                //xs:'',
                md: "flex",
                // sm:"",
                lg: "flex",
                xl: "flex",
              },
              justifyContent: {
                //xs:'',
                md: "center",
                // sm:"",
                lg: "center",
                xl: "center",
              },
            }}
          >
            {services.map((item, index) => {
              return (
                <Grid
                  display={"flex"}
                  justifyContent={"center"}
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  xl={3}
                  key={item}
                  className={item.animate}
                  mb={{
                    xs: 2,
                    sm: 2,
                    md: 4,
                    xl: 4,
                    lg: 4,
                  }}
                >
                  <NavLink to={item.navigateTo}>
                    <Box
                      sx={{
                        padding: "8px",
                        border: 1,
                        //borderRadius: "2ch",
                        borderColor: "white",
                        backgroundColor: "white",
                      }}
                    >
                      <Card
                        className={styles.card}
                        sx={{
                          //borderRadius: "10px",
                          width: {
                            xs: 330,
                            sm: 290,
                            md: 400,
                            lg: 490,
                            xl: 430,
                          },
                          // width: {
                          //   xs: 330,
                          //   sm: 290,
                          //   md: 400,
                          //   lg: 400,
                          //   xl: 430,
                          // },
                          height: {
                            xs: 280,
                            md: 400,
                            sm: 300,
                            lg: 400,
                            xl: 400,
                          },
                        }}
                      >
                        {item.name === "Privilege Services" && (
                          <span
                            style={{
                              background:
                                "linear-gradient(45deg, #c54fff 35%, #3f73fe 65%)",
                              color: "white",
                              height: "40px",
                              width: "200px",
                              position: "absolute",
                              top: 30,
                              fontSize: 20,
                              left: -50,
                              zIndex: 10,
                              transform: "rotate(-45deg)",
                              fontWeight: "bold",
                              letterSpacing: "0.1em",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              overflow: "hidden",
                              boxShadow: "0 5px 10px rgba(0,0,0.0.1)",
                              textTransform: "uppercase",
                            }}
                          >
                            Privilege
                          </span>
                        )}
                        <Box
                          sx={{
                            position: "relative",
                          }}
                        ></Box>
                        <CardMedia
                          sx={{
                            objectFit: "cover",
                          }}
                          component="img"
                          image={item.pic}
                          alt="green iguana"
                          className={styles.card__image}
                        />
                        <CardContent sx={{}} className={styles.card__content}>
                          <Typography
                            className={styles.card__title}
                            gutterBottom
                          >
                            {item.name}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          ></Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              gutterBottom
                              sx={{
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              Description
                            </Typography>
                          </Box>
                          <Divider />
                          <Typography
                            sx={{
                              paddingTop: "5px",
                            }}
                            className={styles.card__text}
                          >
                            Lorem ipsum, dolor sit amet consectetur adipisicing
                            elit. Similique ex qui dolores nisi quam ad rem
                            fuga. Voluptatem numquam sint, animi Lorem ipsum
                            dolor sit amet consectetur adipisicing elit.
                            Sapiente temporibus aspernatur nesciunt amet
                            veritatis ex sequi assumenda illo voluptatibus
                            veniam, magni dolore ea harum quae iusto quia
                            consectetur obcaecati a.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  </NavLink>
                </Grid>
              );
            })}
          </Grid>
        </Layout>
      </Box>
      <Footer />
    </React.Fragment>
  );
};

export default CustomerLandingScreen;
