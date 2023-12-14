import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import {
  Box,
  Breadcrumbs,
  Container,
  Typography,
  useMediaQuery,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  // TextField,
  Button,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import image1 from "../../components/assets/room1.png";
import BedIcon from "@mui/icons-material/Bed";
import PersonIcon from "@mui/icons-material/Person";
import BathtubIcon from "@mui/icons-material/Bathtub";
import Footer from "../../components/Footer";
import {
  contractAddress,
  contractInstance,
  utilityABI,
  web3,
} from "../../configuration/alchemy/alchemy-config";
import { useAccount, useContractWrite } from "wagmi";
import { toast } from "react-toastify";
import axios from "axios";
// import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const RoomBooking = () => {
  const { address } = useAccount();
  const [bookState, setBookState] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const theme = useTheme();
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
  const isMatch = useMediaQuery(theme.breakpoints.only("xs"));
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = React.useState(0);
  const [selectedPeople, setSelectedPeople] = React.useState("");
  useEffect(() => {
    const fetchData = async () => {
      const price = await contractInstance.methods.rates(0).call();
      setRoomPrice(price);
    };
    fetchData();
  }, []);
  const handleChange = (event) => {
    setSelectedRoom(event.target.value);
    setSelectedPeople(event.target.value * 2);
  };
  const { write } = useContractWrite({
    address: contractAddress,
    abi: utilityABI,
    functionName: "mint",
    value: roomPrice,
    onSuccess(data) {
      console.log("wait for confirmation", data);
      // toast("Tx Initiated...", {
      //   position: "top-right",
      //   autoClose: 4000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "dark",
      // });
    },
    onError(error) {
      console.log("admin mint Error", error);

      toast.error("Purchase Failed", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      //button state
      setBookState(false);
    },
    onSettled(data, error) {
      if (error) {
        const errorStringify = JSON.stringify(error);
        const errorParse = JSON.parse(errorStringify);
        console.log("admin mint error from settlement", errorParse);
        toast.error(errorParse?.shortMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setBookState(false);
      } else {
        console.log("placeBidTransaction data hash", data.hash);
        toast("Tx settled wait for confirmation", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        transactionRecipet(data.hash);
      }
    },
  });
  const roomBookingHandler = async () => {
    //calling mint [booking rooms on contract]
    setBookState(true);
    write({
      args: [0, 1],
      from: address,
    });
  };

  /**
   * Checks the transaction is Succeeded of Failed
   * Checks for receipt if none are found calls the same function again to see if any are there, If any were found
   * then displaying the status
   * @param {String} txHash
   * @returns
   */
  const transactionRecipet = async (txHash) => {
    try {
      //checking for recipe using alchemy
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt) {
        console.log("transaction receipt", receipt);
        if (receipt.status) {
          console.log("transactionRecipet Transaction was successful!");
          toast.success("😍 Booking Succesful...", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          //api call for sebding free tokens
          toast.success("Transfering CS-Tokens", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          const response = await axios.post(
            "http://localhost:5000/api/v1/giveTokensToUser",
            { address: address, quantity: selectedRoom },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("transfer tokens ", response);

          if (response.data.success === false) {
            toast.error("User didn't book a room yet", {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            //button state
            setBookState(false);
          }
          if (response.data.success === true) {
            setBookState(false);
            console.log(response.data.txHash);
            toast.success("CS tokens has been transfered", {
              position: "top-right",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            //button state
            //setmintBt(false);
          }

          return true;
        } else {
          console.log("transactionRecipet Transaction failed.");

          toast.error("Transaction Failed...", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          //button state
          setBookState(false);
          return false;
        }
      } else {
        console.log(
          "Transaction receipt not found. The transaction may not be mined yet."
        );
        // calling again if there is no recipet
        transactionRecipet(txHash);
      }
    } catch (error) {
      setBookState(false);
      toast.error(
        `"Error occurred while checking transaction receipt:",
      ${error.message}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      console.error(
        "Error occurred while checking transaction receipt:",
        error.message
      );
      // Handle errors appropriately in your application.
    }
  };
  return (
    <Layout>
      <Container>
        <Breadcrumbs
          aria-label="breadcrumb"
         
        >
          <Typography
            sx={{
              textDecoration: "underline",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            color="inherit"
            onClick={() => navigate("/rooms")}
          >
            Rooms
          </Typography>
          <Typography
            color="text.primary"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            room-booking
          </Typography>
        </Breadcrumbs>
        <Box
          sx={{
            border: "1px solid lightgray",
            p: 2,
            borderRadius: 5,
            boxShadow: "1px 5px 10px rgba(169, 169, 169, 0.6)",
            mt: 1,
            mb: !selectedPeople && !selectedRoom > 0 && 3,
          }}
        >
          <Stack
            direction={{
              xs: "column-reverse",
              sm: "column",
              md: "row",
              lg: "row",
              xl: "row",
            }}
            justifyContent={"space-between"}
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
              <Stack>
                <Typography
                  fontSize={"18px"}
                  fontWeight={"bold"}
                  pb={2}
                  //className={`animate__animated ${item.animationInfo}`}
                  //color={mode.colorMode === "dark" ? "green.300" : "red.400"}
                >
                  Super Deluxe Room
                </Typography>
              </Stack>
              <Stack
                direction={{
                  xs: "column",
                  sm: "column",
                  md: "row",
                  lg: "row",
                  xl: "row",
                }}
                gap={2}
              >
                <Stack direction={"row"}>
                  <BedIcon color="action" />
                  &nbsp;&nbsp;1 Queen bed available
                </Stack>
                <Stack direction={"row"}>
                  <PersonIcon color="action" />
                  &nbsp;&nbsp;sleeps 2
                </Stack>
                <Stack direction={"row"}>
                  <BathtubIcon color="action" />
                  &nbsp;&nbsp;1 Bathroom
                </Stack>
              </Stack>
              <Typography
                fontSize={"14px"}
                pt={1}
                //className={`animate__animated ${item.animationInfo}`}
              >
                {" "}
                42m²• Bay view• Non-smoking• Kitchenette• Wireless Internet•
                Lounge Area• Room Service• Balcony• Outdoor Setting• Mini
                Fridge• Tea/Coffee Maker• Microwave• Bath• Lift/Elevator Access•
                Shower - separate• Daily Room Service• Air conditioned•
                Telephone• Room Safe• Ceiling Fans• Iron/Ironing board• High
                Chair Available• Hairdryer• Television• Cots Available
              </Typography>

              {/* <NavLink to={"/room-booking"}>
                    <Button variant="contained">select</Button>
                  </NavLink> */}
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
              //className={`animate__animated ${item.animationImage}`}
            >
              <img
                style={{
                  borderRadius: "4px",
                }}
                width={"400px"}
                height={"200px"}
                src={image1}
                alt="Dan"
              />
            </Box>
          </Stack>
          <Stack
            direction={{
              xs: "column",
              sm: "column",
              md: "row",
              lg: "row",
              xl: "row",
            }}
            gap={2}
            mt={2}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                No. of Rooms
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedRoom}
                label="No. of Rooms"
                onChange={handleChange}
              >
                <MenuItem value={0}>Select No. of Rooms</MenuItem>
                <MenuItem value={1}>One</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
                <MenuItem value={3}>Three</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                No. of guests
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedPeople}
                label="No. of guests"
                onChange={(e) => setSelectedPeople(e.target.value)}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {item === 0 ? "Select No. of Guests" : item}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ width: "100%" }}
              label="Check-In"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { variant: "outlined" } }}
              disablePast
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ width: "100%" }}
              label="Check-Out"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { variant: "outlined" } }}
              disablePast
            />
          </LocalizationProvider> */}
            {/* <TextField
              type="datetime-local"
              variant="outlined"
              autoComplete="given-name"
              name="baseuri"
              required
              fullWidth
              id="baseuri"
              label="Check-In"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              // helperText={mintFormik.errors.baseuri}
              // error={mintFormik.errors.baseuri ? true : false}
            /> */}
            {/* <TextField
              type="datetime-local"
              variant="outlined"
              autoComplete="given-name"
              name="baseuri"
              required
              fullWidth
              id="baseuri"
              label="Check-Out"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // helperText={mintFormik.errors.baseuri}
              // error={mintFormik.errors.baseuri ? true : false}
            /> */}
          </Stack>
        </Box>
        {selectedPeople && selectedRoom > 0 && (
          <Box
            sx={{
              border: "1px solid lightgray",
              p: 2,
              borderRadius: 5,
              mt: 1,
              mb: 4,
              boxShadow: "1px 5px 10px rgba(169, 169, 169, 0.6)",
            }}
          >
            <Stack
              direction={{
                base: "column",
                sm: "row",
                md: "row",
                lg: "row",
                xl: "row",
              }}
              justifyContent={"space-around"}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  gutterBottom
                  variant="h5"
                >
                  Booking Details
                </Typography>
              </Box>

              <Box>
                <Typography gutterBottom variant="h6">
                  Super Deluxe Room
                </Typography>
                <Stack direction={"row"}>
                  {/* <Typography gutterBottom fontSize={"14px"}>
                    {startDate.split("T")[0]} – {endDate.split("T")[0]}
                  </Typography> */}
                  <Typography gutterBottom fontSize={"14px"}></Typography>
                  <Typography gutterBottom fontSize={"14px"}>
                    &nbsp;[&nbsp;{selectedRoom}-Room
                  </Typography>
                  <Typography gutterBottom fontSize={"14px"}>
                    &nbsp;{selectedPeople}-Guests ]
                  </Typography>
                </Stack>
                <Typography gutterBottom fontSize={"14px"}>
                  Price - {web3.utils.fromWei(roomPrice)} ETH
                </Typography>

                <Button
                  sx={{
                    width: "100px",
                  }}
                  variant="contained"
                  onClick={roomBookingHandler}
                  disabled={bookState}
                >
                  {bookState ? "Booking...." : "Book"}
                </Button>
              </Box>
            </Stack>
          </Box>
        )}
      </Container>
      <Footer />
    </Layout>
  );
};

// 2023-11-08 – 2023-11-10

export default RoomBooking;
