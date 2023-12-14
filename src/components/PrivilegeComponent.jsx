import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import pv from "../components/assets/1.jpg";
import vip from "../components/assets/ps.png";
import resturant from "../components/assets/Events.png";
import golf from "../components/assets/GOLF.png";

import axios from "axios";
const PrivilegeComponent = ({ pTypes }) => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          color: "white",
          pt: 1,
        }}
      >
        <Typography
          sx={{
            textDecoration: "underline",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          color="white"
          onClick={() => navigate("/customer")}
        >
          Services
        </Typography>
        <Typography
          color="white"
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          Privilege Services
        </Typography>
      </Breadcrumbs>

      <PrivilegeTabsComponent pTypes={pTypes} />
      {/* <PrivilegeTabsComponent pTypeSix={pTypeSix} pTypeSeven={pTypeSeven} /> */}
    </>
  );
};

export default PrivilegeComponent;

const CustomTabPanel = (props) => {
  const { children, tabValue, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tabValue !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tabValue === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const PrivilegeTabsComponent = ({ pTypes }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [sendType, setSendType] = useState(pTypes?.[0]);
  const [pServices, setPServices] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post(
        "http://localhost:5000/api/v1/getPrivilegedServicesOnType",
        {
          privilegedType: sendType,
        }
      );
      console.log("PTypes-response", response.data?.result);
      setPServices(response.data?.result);
    };
    fetchData();
  }, [sendType]);
  return (
    <>
      <Box
        sx={{
          marginTop: 3,
          borderBottom: 1,
          borderColor: "#023047",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="inherit"
          indicatorColor="primary"
        >
          {pTypes?.map((item, index) => {
            return (
              <Tab
                onClick={() => setSendType(pTypes[index])}
                label={item}
                sx={{
                  color: "white",
                }}
                {...a11yProps(0)}
              />
            );
          })}
        </Tabs>
      </Box>

      {pTypes?.map((item, index) => {
        return (
          <CustomTabPanel tabValue={tabValue} index={index}>
            <ServicesCards privilegeServices={pServices} />
          </CustomTabPanel>
        );
      })}
      {/* <CustomTabPanel tabValue={tabValue} index={0}>
        <ServicesCards privilegeServices={privilegeServices1} />
      </CustomTabPanel>
      <CustomTabPanel tabValue={tabValue} index={1}>
        <ServicesCards privilegeServices={privilegeServices2} />
      </CustomTabPanel> */}
    </>
  );
};

const ServicesCards = ({ privilegeServices }) => {
  const getImage = (type) => {
    if (type === "Private Villas") {
      return pv;
    } else if (type === "Michelin-Star Dining Experience") {
      return resturant;
    } else if (type === "VIP Access to Exclusive Events") {
      return vip;
    } else {
      return golf
    }
  };
  const getAnimate = (index) => {
    if (index === 0) {
      return "animate__fadeInLeft";
    } else if (index === 1) {
      return "animate__fadeInDown";
    } else {
      return "animate__fadeInRight";
    }
  };
  // const
  return (
    <Grid container rowGap={3}>
      {privilegeServices.map((item, index) => {
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
            key={item.id}
            className={`animate__animated ${getAnimate(index)}`}
          >
            <NavLink
              to={`/services/Privilege/${item.privilegedType}/${item?.privilegedService}/${item.contract}`}
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
                      xs: 320,
                      sm: 300,
                      md: 320,
                      lg: 370,
                      xl: 400,
                    },
                    height: "300px",
                  }}
                >
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
                    image={getImage(item.privilegedService)}
                    alt="green iguana"
                    className="card__image"
                  />
                  <CardContent sx={{}} className="card__content">
                    <Typography className="card__title" gutterBottom>
                      {item.privilegedService}
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
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Similique ex qui dolores nisi quam ad rem fuga. Voluptatem
                      numquam sint, animi
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </NavLink>
          </Grid>
        );
      })}
    </Grid>
  );
};
