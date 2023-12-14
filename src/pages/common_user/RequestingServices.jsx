import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import axios from "axios";
import { object, string } from "yup";
import { useFormik } from "formik";

const RequestingServices = ({ setDialogState }) => {
  const navigate = useNavigate();
  const { address } = useAccount();
  //name,address,email,psType,PsService
  const [type, setType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [services, setServices] = useState([]);
  const [servicesState, setServicesState] = useState(true);
  const [reqBtState, setReqBtState] = useState(false);
  //requesting new Ps service or becoming new PS Service
  const requestNewPS = useFormik({
    initialValues: {
      userName: localStorage.getItem("loggedUser").split("@")[0],
      email: localStorage.getItem("loggedUser"),
      address: address,
      message: "",
      // psType: "",
      // PsService: "",
    },
    validationSchema: object({
      // userName: string().required("User Name Required!"),
      // email: string().email("Invalid Email Format").required("Email required!"),
      message: string().required("Message is Required!"),
      // psType: string().required("Privilege Type  Required!"),
      // PsService: string().required("Privilege Service Required!"),
    }),
    onSubmit: async (values) => {
      console.log("Formik values", values);

      //bt state && api call
      setReqBtState(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/saveTypeWaitlistEntries",
          {
            address: values.address,
            email: values.email,
            name: values.userName,
            text: values.message,
          }
        );
        console.log("request -res", response.data);
        toast.success("Requested Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        //reseting
        requestNewPS.resetForm();
        setReqBtState(false);
        setDialogState(false); // ps dialog state
      } catch (error) {
        console.log(error);
        setReqBtState(false);
        if (error.response.status === 400) {
          requestNewPS.resetForm();
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Failed!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
    },
  });

  //fetching services based on types
  useEffect(() => {
    const fetchData = async () => {
      if (type) {
        setServicesState(false);
        const response = await axios.post(
          "http://localhost:5000/api/v1/getPrivilegedServicesOnType",
          {
            privilegedType: type,
          }
        );
        console.log("type res", response.data?.result);
        setServices(response.data?.result);
        setServicesState(false);
      }
    };
    fetchData();
  }, [type]);

  return (
    <React.Fragment>
      <Layout>
        <Breadcrumbs
          sx={{
            ml: 3,
          }}
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
            onClick={() => navigate("/")}
          >
            Home
          </Typography>
          <Typography
            color="text.primary"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            Utility Token Request
          </Typography>
        </Breadcrumbs>
        <Container
          maxWidth="sm"
          component={Paper}
          elevation={5}
          sx={{
            p: 2,
          }}
        >
          <Typography textAlign={"center"} gutterBottom variant="h5">
            Utility Token Request
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="address"
                required
                fullWidth
                id="address"
                label="User Address"
                value={requestNewPS.values.address}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                required
                fullWidth
                name="userName"
                id="userName"
                label="Name"
                value={requestNewPS.values.userName}
                // onChange={requestNewPS.handleChange}
                // helperText={requestNewPS.errors.userName}
                // error={requestNewPS.errors.userName ? true : false}
                disabled
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                required
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={requestNewPS.values.email}
                // onChange={requestNewPS.handleChange}
                // helperText={requestNewPS.errors.email}
                // error={requestNewPS.errors.email ? true : false}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <textarea
                name="message"
                value={requestNewPS.values.message}
                onChange={requestNewPS.handleChange}
                id="textAreas"
                cols="53"
                rows="5"
                placeholder="Enter Admin Notes"
                style={{
                  fontSize: "18px",
                }}
              ></textarea>
              {/* <TextField
               
                variant="outlined"
                autoComplete="given-name"
                required
                fullWidth
                id="message"
                name="message"
                label="Message"
                 value={requestNewPS.values.message}
                onChange={requestNewPS.handleChange}
                helperText={requestNewPS.errors.message}
                error={requestNewPS.errors.message ? true : false}
              /> */}
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Privilege Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="psType"
                    value={requestNewPS.values.psType}
                    onChange={requestNewPS.handleChange}
                    //helperText={newPSFormik.errors.type}
                    error={requestNewPS.errors.psType ? true : false}
                    name="psType"
                    required
                    label="Select Privilege Type"
                  >
                    <MenuItem
                      value={""}
                      onClick={() => {
                        setType("");
                        setServicesState(true);
                      }}
                    >
                      Select
                    </MenuItem>
                    <MenuItem value={"PT1"} onClick={() => setType("PT1")}>
                      Privilege Service 1
                    </MenuItem>
                    <MenuItem value={"PT2"} onClick={() => setType("PT2")}>
                      Privilege Service 2
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Privilege Service
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="PsService"
                    value={requestNewPS.values.PsService}
                    onChange={requestNewPS.handleChange}
                    //helperText={newPSFormik.errors.type}
                    error={requestNewPS.errors.PsService ? true : false}
                    name="PsService"
                    required
                    label="Select Privilege Service"
                    disabled={servicesState}
                  >
                    {services.map((item) => {
                      return (
                        <MenuItem
                          key={item.contract}
                          value={item?.privilegedService}
                          //onClick={()=>setSelectedService(item.)}
                          onClick={() => setSelectedService(item.contract)}
                        >
                          {item?.privilegedService}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid> */}

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={requestNewPS.handleSubmit}
                disabled={
                  !(requestNewPS.isValid && requestNewPS.dirty) || reqBtState
                }
              >
                {reqBtState ? "Requesting..." : "Request"}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </React.Fragment>
  );
};

export default RequestingServices;
