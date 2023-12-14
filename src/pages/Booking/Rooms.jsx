import React, { useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
// import resturant from "../../components/assets/resturant.png";
import room1 from "../../components/assets/room1.png";
//import room2 from "../../components/assets/room2.png";
import { NavLink } from "react-router-dom";
import BedIcon from "@mui/icons-material/Bed";
import PersonIcon from "@mui/icons-material/Person";
import Footer from "../../components/Footer";
import background from "../../components/assets/book.svg";

const Rooms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const roomTypes = [
    {
      id: 1,
      roomType: "Super Deluxe Rooms",
      roomImage: "",
      roomFor: 2,
      sleeps: "1-2",
      roomDescription:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint pariatur dolor molestiae, quos quod architecto? Dolor, deserunt tempore, commodi quibusdam deleniti minima sunt, eos harum itaque eaque illum mollitia assumenda.",
    },
    {
      id: 2,
      roomType: "Deluxe Rooms",
      roomImage: "",
      roomFor: 2,
      sleeps: "1-2",
      roomDescription:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint pariatur dolor molestiae, quos quod architecto? Dolor, deserunt tempore, commodi quibusdam deleniti minima sunt, eos harum itaque eaque illum mollitia assumenda.",
    },
    {
      id: 3,
      roomType: "Budget Rooms",
      roomImage: "../../components/assets/Image (1).png",
      roomFor: 2,
      sleeps: "1-2",
      roomDescription:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint pariatur dolor molestiae, quos quod architecto? Dolor, deserunt tempore, commodi quibusdam deleniti minima sunt, eos harum itaque eaque illum mollitia assumenda.",
    },
  ];
  const getAnimate = (index) => {
    if (index % 2 === 0) {
      return "animate__fadeInLeft";
    } else {
      return "animate__fadeInRight";
    }
  };
  return (
    <Layout>
      <Box
        style={{
          backgroundImage: `url(${background})`,
          color: "white",
        }}
      >
        <Container
          sx={{
            mb: 2,
          }}
        >
          <Typography variant="h4" textAlign={"center"} p={2}>
            Rooms
          </Typography>
          {roomTypes.map((item, index) => {
            return (
              <div
                key={item.id}
                className={`animate__animated ${getAnimate(index)}`}
              >
                <Stack
                  paddingBottom={5}
                  paddingTop={index !== 0 && 5}
                  direction={{
                    xs: "column-reverse",
                    sm: "column-reverse",
                    md: index % 2 === 0 ? "row" : "row-reverse",
                    lg: index % 2 === 0 ? "row" : "row-reverse",
                    xl: index % 2 === 0 ? "row" : "row-reverse",
                  }}
                  justifyContent={"space-evenly"}
                  //design
                  color={"black"}
                  bgcolor={"white"}
                  borderRadius={"15px"}
                  p={4}
                  mb={1}
                >
                  <Box
                    width={{
                      base: "100%",
                      sm: "100%",
                      md: "100%",
                      lg: "50%",
                      xl: "50%",
                    }}
                  >
                    <Stack direction={"row"} alignItems={"center"}>
                      <Typography
                        fontSize={"18px"}
                        fontWeight={"bold"}
                        pb={2}
                        className={`animate__animated ${item.animationInfo}`}
                        width={"100%"}
                      >
                        {item.roomType}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} gap={2}>
                      <Stack direction={"row"}>
                        <BedIcon color="action" />
                        &nbsp;&nbsp;{item.sleeps}
                      </Stack>
                      <Stack direction={"row"}>
                        <PersonIcon color="action" />
                        &nbsp;&nbsp;{item.roomFor}
                      </Stack>
                    </Stack>
                    <Typography
                      fontSize={"15px"}
                      pb={1}
                      fontFamily={"sans-serif"}
                      className={`animate__animated ${item.animationInfo}`}
                    >
                      {item.roomDescription}
                    </Typography>

                    <NavLink to={"/room-booking"}>
                      <Button variant="contained">select</Button>
                    </NavLink>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    transition="all 0.2s ease"
                    _hover={{
                      cursor: "pointer",
                      transform: "scale(1.1)",
                    }}
                    className={`animate__animated ${item.animationImage}`}
                  >
                    <img
                      style={{
                        borderRadius: "5px",
                        boxShadow: "1px 5px 10px rgba(169, 169, 169, 0.6)",
                      }}
                      width={"400px"}
                      height={"200px"}
                      src={room1}
                      alt="Dan"
                    />
                  </Box>
                </Stack>
                <Divider />
              </div>
            );
          })}
        </Container>
      </Box>
      <Footer />
    </Layout>
  );
};

export default Rooms;
