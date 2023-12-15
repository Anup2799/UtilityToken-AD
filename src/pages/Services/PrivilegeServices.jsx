import React, { useEffect, useState } from "react";
import "./Services.css";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import Footer from "../../components/Footer";
import { useAccount } from "wagmi";
import axios from "axios";
import background from "../../components/assets/bg.svg";

import ps from "../../components/assets/privilege.png";
const PrivilegeServices = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const { address } = useAccount();
  const checkUser = localStorage.getItem("Privilege");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/v1/getUtilityTypes"
      );

      if (response.status === 200) {
        console.log(response.data?.result);
        setServiceTypes(response.data?.result);
      }
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Box
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <Layout>
          <Typography
            paddingTop={"40px"}
            textAlign={"center"}
            variant="h4"
            p={2}
            color={"white"}
            className={`animate__animated animate__fadeInDown`}
          >
            Enjoy Privilege services...
          </Typography>
          <Grid container rowGap={3} pb={5}>
            {serviceTypes.length === 0 ? (
              <Grid
                display={"flex"}
                justifyContent={"center"}
                item
                xs={12}
                sm={6}
                md={6}
                lg={4}
                xl={3}
              >
                <Box
                  sx={{
                    padding: "10px",
                    border: 1,
                    borderRadius: "2ch",
                    borderColor: "white",
                    backgroundColor: "#F5F5ED",
                  }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      width: {
                        xs: 330,
                        sm: 290,
                        md: 400,
                        lg: 400,
                        xl: 430,
                      },
                      height: 280,
                    }}
                  >
                    <Skeleton variant="overlay" height={220}></Skeleton>
                  </Card>
                </Box>
              </Grid>
            ) : (
              serviceTypes.map((item, index) => {
                return (
                  item === "Privilege" && (
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
                      className={`animate__animated animate__fadeInLeft`}
                    >
                      <NavLink
                        to={
                          address === undefined
                            ? `/auth/${item}`
                            : item === "Privilege"
                            ? checkUser === "true"
                              ? `/services/${item}`
                              : "/not-privilege-user"
                            : `/services/${item}`
                        }
                      >
                        <Box
                          sx={{
                            padding: "8px",
                            border: 1,
                            borderRadius: "2ch",
                            borderColor: "white",
                            backgroundColor: "white",
                          }}
                        >
                          <Card
                            className="card"
                            sx={{
                              borderRadius: "10px",
                              width: {
                                xs: 330,
                                sm: 290,
                                md: 400,
                                lg: 400,
                                xl: 430,
                              },
                              height: "300px",
                            }}
                          >
                            {item === "Privilege" && (
                              <span
                                style={{
                                  background:
                                    "linear-gradient(45deg, #c54fff 35%, #3f73fe 65%)",
                                  color: "white",
                                  height: "40px",
                                  width: "200px",
                                  position: "absolute",
                                  top: 30,
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
                                {item}
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
                              image={ps}
                              alt="green iguana"
                              className="card__image"
                            />
                            <CardContent sx={{}} className="card__content">
                              <Typography className="card__title" gutterBottom>
                                Privilege Services
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
                                className="card__text"
                              >
                                Lorem ipsum, dolor sit amet consectetur
                                adipisicing elit. Similique ex qui dolores nisi
                                quam ad rem fuga. Voluptatem numquam sint, animi
                              </Typography>
                            </CardContent>
                          </Card>
                        </Box>
                      </NavLink>
                    </Grid>
                  )
                );
              })
            )}
          </Grid>
        </Layout>
      </Box>
      <Footer />
    </React.Fragment>
  );
};

export default PrivilegeServices;
