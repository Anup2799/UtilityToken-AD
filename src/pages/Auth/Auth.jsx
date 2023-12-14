import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Layout from "../../components/Layout/Layout";
import { Box, Divider, Stack, useMediaQuery } from "@mui/material";
import {
  useAccount,
  useDisconnect,
  useNetwork,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useWeb3Modal } from "@web3modal/react";
import axios from "axios";
import { useTheme } from "@emotion/react";

export default function Auth() {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.only("xs"));
  const isMatchSM = useMediaQuery(theme.breakpoints.only("sm"));
  const navigate = useNavigate();
  const { serviceTye } = useParams();
  //disableing the connect from sending multiple requests
  const [connectDisable, setConnectDisable] = React.useState(false);

  //web3Modal hook
  const { open } = useWeb3Modal();
  //disconnect hook from wagmi
  const { disconnect } = useDisconnect();

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const loginFormik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      console.log(values, "login formik values");
    },
    validationSchema: object({
      email: string("Enter email")
        .email("pls enter in correct format")
        .required("Email is Required"),
    }),
  });
  let message;
  const { signMessageAsync } = useSignMessage({
    message,
  });

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  //wagmi hook for accounts
  // eslint-disable-next-line no-unused-vars
  const { address } = useAccount({
    onConnect({ address }) {
      //goreli
      // if (chain?.id !== 5) {
      //   switchNetwork?.(5);
      // }
      if (chain?.id !== 80001) {
        switchNetwork?.(80001);
      }
      console.log(address);
      setConnectDisable(true);
      const jwt = localStorage.getItem("jwtToken");
      // checking for jwt if there is no jwt in the localstorage the written flow will be excuted
      // fetching the nonce and sending the nonce to sign will get the signature, sending the signature to backend
      // for validation of wallet address in response will the jwt token if the authentication successful
      if (!jwt) {
        console.log("hello jwt");
        const FetchJWT = async () => {
          //fetching nonce
          try {
            //const nonceAPI = process.env.REACT_APP_GENERATE_NONCE_API;
            const nonceAPI = "http://localhost:5000/api/v1/generateNonce";
            const nonce = await axios.post(nonceAPI, {
              email: loginFormik.values.email,
              address: address,
            });

            //sending the nonce to sign
            const signature = await signMessageAsync({
              message: `I am signing my one-time nonce: ${nonce.data.message}`,
            });
            // authenticating the signature
            //const authenticateURL = process.env.REACT_APP_AUTHENTICATE_API;
            const authenticateURL = "http://localhost:5000/api/v1/authenticate";
            const authenticateResponce = await axios.post(authenticateURL, {
              email: loginFormik.values.email,
              address: address,
              signature: signature,
            });
            if (authenticateResponce.data?.userType === "admin") {
              toast.success("Hello Admin, welcome Back.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            }
            console.log("authenticateResponce", authenticateResponce);
            // setting token on localstorage

            localStorage.setItem("jwtToken", authenticateResponce.data.token);
            localStorage.setItem("aUser", authenticateResponce.data?.userType);

            //Check-Privilege user or not
            if (
              serviceTye !== "admin" &&
              authenticateResponce.data?.userType !== "admin"
            ) {
              toast("Just a Moment", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              const checkPrivileged = await axios.post(
                "http://localhost:5000/api/v1/checkPrivileged",
                { address },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              //setting user
              localStorage.setItem("loggedUser", loginFormik.values.email);

              console.log("checkPrivileged", checkPrivileged);
              console.log(
                "checkPrivileged-result",
                checkPrivileged.data.answer
              );
              if (checkPrivileged.data?.answer?.length === 0) {
                localStorage.setItem("Privilege", false);
                if (authenticateResponce.data?.userType !== "admin") {
                  toast.success("Hello, welcome Back", {
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
              } else {
                //setting how many types he is holding of PS's
                localStorage.setItem(
                  "P-Types",
                  JSON.stringify(checkPrivileged.data.answer)
                );
                localStorage.setItem("Privilege", true);
                toast.success("Hello, welcome Back Privilege User", {
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
            }
            setConnectDisable(false);

            //navigating user based on route type
            if (serviceTye === "rooms") {
              navigate("/rooms");
              toast.success("Hello, welcome Back", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            } else if (serviceTye === "admin") {
              //checking for admin or not
              if (authenticateResponce.data?.userType === "admin") {
                console.log("admin logged");
                localStorage.setItem("loggedUser", loginFormik.values.email);
                navigate("/admin");
              }
            } else {
              //checking privilege user or not
              const checkUser = localStorage.getItem("Privilege");
              if (checkUser === "true" && serviceTye !== "Privilege") {
                // eslint-disable-next-line no-restricted-globals
                const navigateIfuser = confirm(
                  "you are a Privilege user navigate to Privilege services, press Ok"
                );
                //confirm start
                if (navigateIfuser === true) {
                  navigate(`/services/Privilege`);
                } else {
                  navigate(`/services/${serviceTye}`);
                }
                //confirm end
              } else {
                if (serviceTye === "Privilege" && checkUser === "false") {
                  navigate("/not-privilege-user");
                } else {
                  navigate(`/services/${serviceTye}`);
                }
              }
            }
          } catch (error) {
            setConnectDisable(false);
            console.log(error);
            console.log(error.message);
            if (error?.response?.status === 400) {
              if (serviceTye === "admin") {
                toast.success("Sorry, Not Admin", {
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
              toast.error(
                "Your Email is Not Associated with this Account try Again",
                {
                  position: "top-right",
                  autoClose: false,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                }
              );

              disconnect();
              localStorage.setItem("FailedUser", true);
              localStorage.removeItem("jwtToken");
            } else {
              toast.error(error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              disconnect();
              localStorage.removeItem("jwtToken");
            }
          }
        };
        FetchJWT();

        //after connecting check the user is admin or not and check registered or not
        //if admin will navigate to admin screen
        // if user not registerd will navigate to login or register
      }
    },
  });

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      open();
      setConnectDisable(true);
    }
  };

  return (
    <React.Fragment>
      <div>
        <Layout>
          <Container>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Stack
                direction={{
                  xs: pathname === "/auth/Privilege" && "column",
                  md: pathname === "/auth/Privilege" && "row",
                  sm: pathname === "/auth/Privilege" && "column",
                  xl: pathname === "/auth/Privilege" && "row",
                  lg: pathname === "/auth/Privilege" && "row",
                }}
                gap={
                  pathname === "/auth/Privilege" && !isMatch && !isMatchSM
                    ? "100px"
                    : "20px"
                }
              >
                <Box>
                  <Typography component="h1" variant="h5">
                    Please enter your Email to continue
                  </Typography>
                  <Typography fontWeight={"400"} color={"gray"}>
                    This email should associate with wallet account
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                  >
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      value={loginFormik.values.email}
                      onChange={loginFormik.handleChange}
                      helperText={loginFormik.errors.email}
                      error={loginFormik.errors.email ? true : false}
                      onKeyDown={onKeyDownHandler}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={() => {
                        open();
                        setConnectDisable(true);
                        // setConnectDisable(isConnected ? false : true);
                      }}
                      disabled={
                        !(loginFormik.isValid && loginFormik.dirty) ||
                        connectDisable
                      }
                    >
                      {connectDisable ? "Connecting..." : "Continue"}
                    </Button>
                  </Box>
                </Box>
                {pathname === "/auth/Privilege" && (
                  <>
                    <Divider
                      orientation={
                        isMatch && isMatchSM ? "Horizontal" : "vertical"
                      }
                      flexItem
                    ></Divider>
                    <Box
                      pl={!isMatch && !isMatchSM ? 11 : 0}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        Interested in Privilege Services?
                      </Typography>
                      <Button variant="contained">Contact us</Button>
                    </Box>
                  </>
                )}
              </Stack>
            </Box>
          </Container>
        </Layout>
      </div>
    </React.Fragment>
  );
}
