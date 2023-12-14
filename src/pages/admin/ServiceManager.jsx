import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./ServiceManager.module.css";
import { object, number, string } from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import {
  contractAddress,
  utilityABI,
  web3,
} from "../../configuration/alchemy/alchemy-config";
import privilegeABI from "../../contracts/privilegeABI.json";
import { useAccount, useContractWrite } from "wagmi";
import villa from "../../components/assets/1.jpg";
import ps from "../../components/assets/ps.png";
import golf from "../../components/assets/GOLF.png";
import dine from "../../components/assets/Events.png";
import Loading from "../../components/Loading/Loading";
import LoadingBackdrop from "../../components/Loading/LoadingBackdrop";

const ServiceManager = ({ P_Type }) => {
  //ps state
  const [psData, setPSData] = useState([]);
  const [addBt, setAddBt] = useState(false);
  //update supply stae
  const [updateSupplyState, setUpdateSupplyState] = useState(null);
  const [updateBt, setUpdateBt] = useState(false);
  const [onUpdateSuccess, setOnUpdateSuccess] = useState(false);
  //total supply stae
  const [totalSupply, setTotalSupply] = useState(null);
  const { address } = useAccount();
  //selected privilege service for dialgog
  const [selectedPS, setSelectedPS] = useState(null);
  const [selectedPSContract, setSelectedPSContract] = useState(null);

  //token detials
  const [nftDetailsDialog, setNftDetailsDialog] = useState(false);
  const [nfts, setNfts] = useState([]);

  //loading
  const [loading, setLoading] = useState(false);
  //new privilige type dialog
  const [openPrivilegeType, setOpenPrivilegeType] = useState(false);

  //re-fetch
  const [reFetchData, setReFetchData] = useState(false);

  //create privilege type token
  const [pTCreateBT, setPTCreateBT] = useState(false);
  //new privilege service formik
  const newPSFormik = useFormik({
    initialValues: {
      serviceName: "",
      symbol: "",
      baseuri: "",
      price: "",
      type: "",
    },
    validationSchema: object({
      baseuri: string()
        .url("Invalid URL format")
        .required("baseuri is required!"),
      price: number("only numbers").required("Price required!").positive(),
      serviceName: string().required("Service Name required!"),
      symbol: string().required("Symbol required!"),
      type: string().required("Type required!"),
    }),
    onSubmit: async (values) => {
      console.log("Formik values", values);

      //bt state && api call
      setAddBt(true);

      try {
        const apiUrl = "http://localhost:5000/api/v1/deployPrivilegedContract";
        const response = await axios.post(apiUrl, {
          firstContractAddress: contractAddress,
          baseURI: values.baseuri,
          price: values.price,
          name: `${values.type}-${values.serviceName}`,
          symbol: values.symbol,
          privilegedType: values.type,
          privilegedService: values.serviceName,
        });
        console.log("new-PS-service-response", response);
        toast.success(`Added ${values.serviceName}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        newPSFormik.resetForm();
        setLoadServices(true);
        //dialog state
        setOpen(false);
        setAddBt(false);
        setReFetchData(true);
      } catch (error) {
        setAddBt(false);
        console.log(error);
        if (error.message === "Network Error") {
          toast.error("Network Error", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 4000,
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
    },
  });
  const [loadServices, setLoadServices] = useState(false);
  const [reFetchPrivilegeType, setReFetchPrivilegeTypes] = useState(false);
  const [privilegeTypes, setprivilegeTypes] = useState([]);
  //fetching privilege types
  useEffect(() => {
    const fetchData = async () => {
      const typesResponse = await axios.get(
        "http://localhost:5000/api/v1/getPrivilegedTypes"
      );

      console.log("typesResponse", typesResponse.data.result);
      setprivilegeTypes(typesResponse.data.result);
    };
    fetchData();
  }, [reFetchPrivilegeType]);
  //new service handlers and state
  const [open, setOpen] = React.useState(false);
  const addNewPSService = async () => {
    newPSFormik.handleSubmit();
  };

  //privilege service tabel
  const [privilegeTableOpen, setPrivilegeTableOpen] = React.useState(false);
  const privilegeTableHandleClose = () => {
    setPrivilegeTableOpen(false);
  };
  //setting PS NAME
  const handlePSSelect = (name, contract) => {
    setSelectedPS(name);
    setSelectedPSContract(contract);
    setPrivilegeTableOpen(true);
  };

  //modify dialog
  const [modifyDialogOpen, setModifyDialogOpen] = React.useState(false);
  const modifyDialogClose = () => {
    setModifyDialogOpen(false);
  };

  //fetching privilege services /api/v1/getPrivilegedContracts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/v1/getPrivilegedContracts"
      );
      console.log("PS", response);
      // setPSData(response.data.result);

      //modifing
      let newAr = [];
      const r = response.data.result;
      for (let i = 0; i < r.length; i++) {
        if (i % 2 === 0) {
          newAr.push({
            ...r[i],
            animi: "animate__animated animate__fadeInLeft",
          });
        } else {
          newAr.push({
            ...r[i],
            animi: "animate__animated animate__fadeInDown",
          });
        }
      }
      setPSData(newAr);
      setReFetchData(false);
      setLoading(false);
    };
    fetchData();
  }, [reFetchData]);

  const updateSupply = () => {
    //sending transaction
    updateSupplyTransaction.write({
      args: [updateSupplyState],
      from: address,
    });
    setUpdateBt(true);
  };

  //fetching minted NFTs 
  useEffect(() => {
    const data = async () => {
      if (selectedPSContract) {
        const options = {
          method: "GET",
          url: "https://polygon-mumbai.g.alchemy.com/v2/8kbfGe4lz8I7NRg5PbtvkJG1Fw7Rz6iu/getNFTsForCollection",
          params: {
            contractAddress: selectedPSContract,
            // collectionSlug: "boredapeyachtclub",
            withMetadata: "true",
          },
          headers: { accept: "application/json" },
        };
        const response = await axios.request(options);
        console.log("NFTs response", response.data?.nfts);
        setNfts(response.data?.nfts);
        for (let i = 0; i < response.data.nfts.length; i++) {
          console.log(response.data.nfts[i]);
        }
      }
    };
    data();
  }, [selectedPSContract]);

  //update supply transaction
  const updateSupplyTransaction = useContractWrite({
    address: selectedPSContract,
    abi: privilegeABI,
    functionName: "updateSupply",
    onSuccess(data) {
      console.log("wait for confirmation", data);
      toast("Tx Initiated...", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
      setUpdateBt(false);
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
        setUpdateBt(false);
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
  //create new Privilege type transaction
  const newPrivilegeTypeTransaction = useContractWrite({
    address: contractAddress,
    abi: utilityABI,
    functionName: "addTokenType",
    onSuccess(data) {
      console.log("wait for confirmation", data);
      toast("Tx Initiated...", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
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
      setPTCreateBT(false);
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
        setPTCreateBT(false);
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

  //api call state after creating
  const [callAPi, setCallApi] = useState(false);
  //Create New Privilige Type Formik
  const newPrivilegeTypeFormik = useFormik({
    initialValues: {
      adminAddress: address,
      privilegeType: "",
      totalSupply: "",
      price: "10000000000000000",
    },
    validationSchema: object({
      totalSupply: number("only numbers")
        .required("Price required!")
        .positive(),
      privilegeType: string().required("Privilege Tyoe is Required!"),
    }),
    onSubmit: async (values) => {
      console.log("Formik values", values);

      //checking for type exists or not
      setPTCreateBT(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/checkPrivilegedType",
          {
            privilegedType: values.privilegeType,
          }
        );
        console.log("checkPrivilegedType res", response.data);
        if (response.data.success) {
          //contract call
          toast(`Creating new ${values.privilegeType}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setCallApi(true);
          newPrivilegeTypeTransaction.write({
            args: [values.totalSupply, values.price],
            from: address,
          });
        }
      } catch (error) {
        setPTCreateBT(false);
        console.log("checkPrivilegedType", error);
        if (error.response.status === 400) {
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
        }
      }
      //bt state && api call
      // setPTCreateBT(true)
    },
  });

  //creating new Privilege Type contract

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
          toast.success("😍 Transaction Succesful...", {
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
          setUpdateBt(false);
          //re-fetch supply
          setOnUpdateSuccess(true);

          setModifyDialogOpen(false); //closing update supply dialog after success

          //calling api to save type in DB
          if (callAPi) {
            try {
              const response = await axios.post(
                "http://localhost:5000/api/v1/createNewPrivilegeType",
                {
                  address: newPrivilegeTypeFormik.values.adminAddress,
                  privilegedType: newPrivilegeTypeFormik.values.privilegeType,
                  price: newPrivilegeTypeFormik.values.price,
                  supply: newPrivilegeTypeFormik.values.totalSupply,
                }
              );
              console.log("createNewPrivilegeType", response.data);
              if (response.data.success) {
                toast.success("Details Saved to DB!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });

                //loading states
                newPrivilegeTypeFormik.resetForm();
                setPTCreateBT(false);
                ////closingCreate New Privilige Type dialog
                setOpenPrivilegeType(false);
                setReFetchPrivilegeTypes(true);
                toast("Fetching Privilege Types", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
              }
            } catch (error) {
              setPTCreateBT(false);
              console.log(error);
              toast.error("Failed while Adding Type", {
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

          return true;
        } else {
          console.log("transactionRecipet Transaction failed.");
          setPTCreateBT(false);
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
          setUpdateBt(false);

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
      //button state
      setUpdateBt(false);
      setPTCreateBT(false);
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
    }
  };
  const getImage = (type) => {
    if (type === "Private Villas") {
      return villa;
    } else if (type === "VIP Access to Entertainment") {
      return ps;
    } else if (type === "GOLF") {
      return golf;
    } else {
      return dine;
    }
  };
  const [services, setServices] = useState([]);
  const [selectedType, setSelectedType] = useState(P_Type);
  useEffect(() => {
    const fetchData = async () => {
      //setServicesState(false);
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/getPrivilegedServicesOnType",
        {
          privilegedType: selectedType,
        }
      );
      console.log("type res", response.data?.result);
      setServices(response.data?.result);
      // setServicesState(false);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [selectedType, loadServices]);

  return (
    <>
      {loading ? (
        <Box
          sx={{
            height: "410px",
          }}
        >
          <Loading />
        </Box>
      ) : (
        <Container
          maxWidth="xl"
          sx={{
            pb: 15,
          }}
        >
          <Grid container pb={2} >
            <Grid
            className="animate__animated animate__fadeInLeft"
              item
              xs={12}
              sm={12}
              md={6}
              xl={6}
              lg={7}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                gutterBottom
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                    md: "20px",
                    lg: "22px",
                    xl: "24px",
                  },
                }}
                color={"white"}
              >
                Please select a service to continue or{" "}
                <Link
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => setOpen(true)}
                  color="#Ffff00"
                >
                  Add a New Premium Service
                </Link>
              </Typography>
            </Grid>
            {privilegeTypes.length > 0 && (
              <Grid
              className="animate__animated animate__fadeInRight"
                item
                xs={12}
                sm={12}
                md={6}
                xl={6}
                lg={5}
                component={Paper}
                p={1}
                sx={{
                  borderRadius: 2,
                }}
                elevation={5}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Service Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedType}
                    label="Select Service Type"
                  >
                    {privilegeTypes.map((item, index) => {
                      return (
                        <MenuItem
                          key={index + 1}
                          value={item?.privilegedType}
                          onClick={() => setSelectedType(item?.privilegedType)}
                          color="black"
                        >
                          {item?.privilegedType}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Grid container rowGap={1}>
            {services.map((item, index) => {
              return (
                <Grid
                  display={"flex"}
                  justifyContent={"center"}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  key={item._id}
                  className={item.animi}
                >
                  <Card
                    onClick={() =>
                      handlePSSelect(item.privilegedService, item.contract)
                    }
                    className={styles.card}
                    sx={{
                      borderRadius: "10px",
                      width: {
                        xs: 320,
                        sm: 300,
                        md: 320,
                        lg: 300,
                        xl: 250,
                      },
                      // width: {
                      //   xs: 320,
                      //   sm: 300,
                      //   md: 320,
                      //   lg: 370,
                      //   xl: 400,
                      // },
                      height: "250px",
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
                      className={styles.card__image}
                    />
                    <CardContent className={styles.card__content}>
                      <Typography className={styles.card__title} gutterBottom>
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
                    </CardContent>
                  </Card>
                  {/* </Box> */}
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}
      {/* new service dialog  */}
      <Dialog
        open={open}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Add a New Premium Service
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="serviceName"
                required
                fullWidth
                id="serviceName"
                label="Service Name"
                value={newPSFormik.values.serviceName}
                onChange={newPSFormik.handleChange}
                helperText={newPSFormik.errors.serviceName}
                error={newPSFormik.errors.serviceName ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="symbol"
                required
                fullWidth
                id="symbol"
                label="Symbol"
                value={newPSFormik.values.symbol}
                onChange={newPSFormik.handleChange}
                helperText={newPSFormik.errors.symbol}
                error={newPSFormik.errors.symbol ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="baseuri"
                required
                fullWidth
                id="baseuri"
                label="Base uri"
                value={newPSFormik.values.baseuri}
                onChange={newPSFormik.handleChange}
                helperText={newPSFormik.errors.baseuri}
                error={newPSFormik.errors.baseuri ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="price"
                required
                fullWidth
                id="price"
                label="Price"
                value={newPSFormik.values.price}
                onChange={newPSFormik.handleChange}
                helperText={newPSFormik.errors.price}
                error={newPSFormik.errors.price ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select PS Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="type"
                  value={newPSFormik.values.type}
                  onChange={newPSFormik.handleChange}
                  //helperText={newPSFormik.errors.type}
                  error={newPSFormik.errors.type ? true : false}
                  name="type"
                  required
                  label="Select PS Type"
                >
                  {privilegeTypes.map((item) => {
                    return (
                      <MenuItem key={item} value={item?.privilegedType}>
                        {item?.privilegedType}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Link
            sx={{
              marginRight: "auto",
              pl: 2,
              "&:hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => {
              setOpenPrivilegeType(true);
              setOpen(false);
            }}
          >
            Create new Privilege Type
          </Link>
          <Button
            onClick={() => {
              setOpen(false);
              newPSFormik.resetForm();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={addNewPSService}
            variant="contained"
            disabled={!(newPSFormik.isValid && newPSFormik.dirty) || addBt}
          >
            {addBt ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* premium services table  */}
      <Dialog
        open={privilegeTableOpen}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontSize: {
              xs: "16px",
              sm: "16px",
              md: "20px",
              lg: "22px",
              xl: "24px",
            },
          }}
        >
          {selectedPS}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <ServiceTable
            setModifyDialogOpen={setModifyDialogOpen}
            contractAddress={selectedPSContract}
            setTotalSupply={setTotalSupply}
            onUpdateSuccess={onUpdateSuccess}
            setOnUpdateSuccess={setOnUpdateSuccess}
            setNftDetailsDialog={setNftDetailsDialog}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={privilegeTableHandleClose}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* modify dialog  */}
      <Dialog
        open={modifyDialogOpen}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Modify
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid
            container
            spacing={1}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid item xs={3} sm={3} md={3} lg={3}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="supplu"
                required
                fullWidth
                id="serviceName"
                label="Total Supply"
                value={totalSupply}
                disabled
              />
            </Grid>
            <Grid item xs={6} sm={7} md={7} lg={7}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="supplu"
                required
                fullWidth
                id="serviceName"
                label="Total Supply"
                value={updateSupplyState}
                onChange={(e) => setUpdateSupplyState(e.target.value)}
              />
            </Grid>
            <Grid item xs={3} sm={2} md={2} lg={2}>
              <Button
                variant="contained"
                onClick={updateSupply}
                disabled={!updateSupplyState || updateBt}
              >
                {updateBt ? "Updating..." : "Update"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={modifyDialogClose} variant="outlined" color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* NFT details dialog  */}
      <Dialog
        open={nftDetailsDialog}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 450 } }}
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          NFT Details
        </DialogTitle>
        <Divider />
        <DialogContent>
          <NFTSTable nfts={nfts} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setNftDetailsDialog(false)}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* create newy privilege type  */}
      <Dialog
        open={openPrivilegeType}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 450 } }}
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Create New Privilige Type
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={12} xl={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="privilegeType"
                required
                fullWidth
                id="privilegeType"
                label="Privilege Type"
                value={newPrivilegeTypeFormik.values.privilegeType}
                onChange={newPrivilegeTypeFormik.handleChange}
                helperText={newPrivilegeTypeFormik.errors.privilegeType}
                error={
                  newPrivilegeTypeFormik.errors.privilegeType ? true : false
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={12} xl={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="totalSupply"
                required
                fullWidth
                id="totalSupply"
                label="Total Supply"
                value={newPrivilegeTypeFormik.values.totalSupply}
                onChange={newPrivilegeTypeFormik.handleChange}
                helperText={newPrivilegeTypeFormik.errors.totalSupply}
                error={newPrivilegeTypeFormik.errors.totalSupply ? true : false}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenPrivilegeType(false);
              newPrivilegeTypeFormik.resetForm();
              setOpen(true);
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              newPrivilegeTypeFormik.handleSubmit();
              // setOpenPrivilegeType(false);
            }}
            variant="contained"
            color="primary"
            disabled={
              !(
                newPrivilegeTypeFormik.isValid && newPrivilegeTypeFormik.dirty
              ) || pTCreateBT
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {updateBt && (
        <LoadingBackdrop
          state={updateBt}
          description={"Updating Total Supply"}
        />
      )}

      {pTCreateBT && (
        <LoadingBackdrop
          state={pTCreateBT}
          description={"Creating new Privilege Type"}
        />
      )}

      {/* adding new service  */}
      {addBt && (
        <LoadingBackdrop
          state={addBt}
          description={"Creating new Privilege Service"}
        />
      )}
    </>
  );
};

export default ServiceManager;

const ServiceTable = ({
  setModifyDialogOpen, //modify dialog
  contractAddress, // address
  setTotalSupply, //total suppluy
  onUpdateSuccess, //setting state to fetch
  setOnUpdateSuccess, //fetching data for remaning
  setNftDetailsDialog, // nft details dialog
}) => {
  const [contractData, setContractData] = useState({
    totalSupply: "",
    minted: "", //   totalsuply
    availed: "", //burn
    balance: "", // max_sale - totalsuply
    baseUri: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const instance = new web3.eth.Contract(privilegeABI, contractAddress);
      const MAX_SALE = await instance.methods.MAX_SALE().call();
      const minted = await instance.methods.totalSupply().call();
      // const base = await instance.methods.baseURI().call();
      setContractData({
        totalSupply: MAX_SALE,
        minted: minted,
        balance: MAX_SALE - minted,
        availed: "WIP",
        // baseUri: base,
      });
      setTotalSupply(MAX_SALE);
      setOnUpdateSuccess(false);
    };
    fetchData();
  }, [contractAddress, onUpdateSuccess]);

  const rows = [
    {
      name: "Total Utility Tokens",
      value: !contractData.totalSupply ? (
        <CircularProgress />
      ) : (
        contractData.totalSupply
      ),
      moreInfo: "Modify",
    },
    {
      name: "Minted",
      value: !contractData.minted ? <CircularProgress /> : contractData.minted,
      moreInfo: "Minted Details",
    },
    {
      name: "Availed",
      value: !contractData.availed ? (
        <CircularProgress />
      ) : (
        contractData.availed
      ),
      moreInfo: "Details",
    },
    {
      name: "Balance Available",
      value: !contractData.balance ? (
        <CircularProgress />
      ) : (
        contractData.balance
      ),
      moreInfo: "",
    },
  ];

  return (
    <TableContainer component={Paper} elevation={5}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
              }}
            >
              Privilege Service
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
              }}
            >
              Available
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
              }}
            >
              More Info
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                sx={{
                  fontWeight: "bold",
                }}
                component="th"
                scope="row"
              >
                {row.name}
              </TableCell>
              <TableCell
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                {row.value}
              </TableCell>
              <TableCell>
                {" "}
                <Link
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                  onClick={
                    row.moreInfo === "Modify"
                      ? () => setModifyDialogOpen(true)
                      : row.moreInfo === "Minted Details"
                      ? () => setNftDetailsDialog(true)
                      : null
                  }
                >
                  {row.moreInfo}
                </Link>{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const NFTSTable = ({ nfts }) => {
  const headers = [
    "S No.",
    "Contract Address",
    "Token Id",
    "Chain",
    "Token URI",
  ];
  return (
    <TableContainer component={Paper} elevation={5}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((item) => {
              return (
                <TableCell
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {item}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {nfts?.length === 0 && <Typography p={3}>No NFTs</Typography>}

          {nfts?.length > 0 &&
            nfts.map((row, index) => (
              <TableRow
                key={row?.contract?.address}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {String(row?.contract?.address).substring(0, 3) +
                    "..." +
                    String(row?.contract?.address).substring(35)}
                </TableCell>
                <TableCell>
                  {String(row?.id?.tokenId).substring(0, 3) +
                    "..." +
                    String(row?.id?.tokenId).substring(62)}
                </TableCell>
                <TableCell>POLYGON</TableCell>
                <TableCell>
                  <Link
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    component={"a"}
                    href={`${row?.tokenUri?.raw}.json`}
                    target="_blank"
                  >
                    {String(row?.tokenUri?.raw).substring(0, 7) +
                      "..." +
                      String(row?.tokenUri?.raw).substring(95)}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
