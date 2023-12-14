import React, { useEffect } from "react";
import LayoutWrapper from "../../components/Layout/Layout";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
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
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  contractAddress,
  contractInstance,
  utilityABI,
  web3,
} from "../../configuration/alchemy/alchemy-config";
import { useFormik } from "formik";
import { object, number, string } from "yup";
import { useAccount, useContractWrite } from "wagmi";
import { toast } from "react-toastify";
import { useState } from "react";
import Loading from "../../components/Loading/Loading";
import ServiceManager from "./ServiceManager";
import background from "../../components/assets/bg1.svg";
import axios from "axios";
import LoadingBackdrop from "../../components/Loading/LoadingBackdrop";

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
      {tabValue === index && (
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};
const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Admin = () => {
  // const { address } = useAccount();
  const [tabValue, setTabValue] = React.useState(0);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const tabs = [
    "Airdrop",
    "Manage Privilege Services",
    "Privilege Service Requests",
    "Privilege Type Requests",
  ];
  const [p_type, setp_type] = useState(null);
  const customPanels = [
    <MintForm />,
    <ServiceManager P_Type={p_type} />,
    <PrivilegeServiceTable />,
    <PrivilegeTypeTable />,
  ];
  return (
    <React.Fragment>
      <LayoutWrapper>
        <Box
          sx={{
            backgroundImage: `url(${background})`,
            // pb: 5,
          }}
        >
          <Box
            sx={{
              // marginTop: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
              centered
              color="white"
              textColor="inherit"
              sx={{
                borderBottom: "1px solid #1976d2",
              }}
            >
              {tabs.map((item, index) => {
                return (
                  <Tab
                    onClick={
                      item === "Manage Privilege Services"
                        ? () => setp_type("PT1")
                        : null
                    }
                    sx={{
                      color: "white",
                    }}
                    label={item}
                    {...a11yProps(index)}
                  />
                );
              })}
            </Tabs>
          </Box>
          {customPanels.map((item, index) => {
            return (
              <CustomTabPanel key={index + 1} tabValue={tabValue} index={index}>
                <Box width={"100%"} height={"100%"}>
                  {item}
                </Box>
              </CustomTabPanel>
            );
          })}
        </Box>
      </LayoutWrapper>
    </React.Fragment>
  );
};

export default Admin;

const MintForm = () => {
  // const [selectedService, setSelectedService] = useState("");
  // const [selectedServiceContract, setSelectedServiceContract] = useState("");
  const [privilegeTypes, setPrivilegeTypes] = useState([]);
  const [services, setServices] = useState([]);
  const [mintBt, setmintBt] = useState(false);
  const { address } = useAccount();
  console.log("wallet address-98", address);
  const mintFormik = useFormik({
    initialValues: {
      toAddress: "",
      type: "",
      // contractAddress: "",
    },
    validationSchema: object({
      type: string("").required("Service Required!"),
      toAddress: string()
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Metamask address")
        .required("Metamask is required"),
    }),
    onSubmit: async (values) => {
      console.log("Formik values", values);

      //bt state
      setmintBt(true);

      // sending transaction
      write({
        args: [values.toAddress, values.type, 1],
        from: address,
      });
    },
  });

  const { write } = useContractWrite({
    address: contractAddress,
    abi: utilityABI,
    functionName: "adminMint",
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
      setmintBt(false);
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
        setmintBt(false);
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
          setmintBt(false);

          //setter
          mintFormik.resetForm();

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
          setmintBt(false);
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
  const mintHandler = () => {
    //formik
    //setAddressState(mintFormik.values.toAddress);
    mintFormik.handleSubmit();
  };

  //fetching all services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getAllPrivilegedServices"
        );
        const typesResponse = await axios.get(
          "http://localhost:5000/api/v1/getPrivilegedTypes"
        );
        console.log("servicess", response.data.result);
        console.log("typesResponse", typesResponse.data.result);
        setServices(response.data?.result);
        setPrivilegeTypes(typesResponse.data?.result);
      } catch (error) {
        console.log(error);
        if (error.code === "ERR_NETWORK") {
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
        }
      }
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Box height={"410px"}>
        <Container
          className="animate__animated animate__fadeInDown"
          maxWidth="sm"
          component={Paper}
          elevation={6}
          sx={{
            p: 2,
          }}
        >
          <Typography textAlign={"center"} variant="h5">
            Airdrop User
          </Typography>
          <Grid container spacing={3} marginTop={"5px"}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="toAddress"
                required
                fullWidth
                id="toAddress"
                label="User Address"
                value={mintFormik.values.toAddress}
                onChange={mintFormik.handleChange}
                helperText={mintFormik.errors.toAddress}
                error={mintFormik.errors.toAddress ? true : false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Service Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={mintFormik.values.type}
                  label="Select Service Type"
                  onChange={mintFormik.handleChange}
                  // helperText={mintFormik.errors.type}
                  error={mintFormik.errors.type ? true : false}
                  name="type"
                  required
                >
                  {privilegeTypes.map((item, index) => {
                    return (
                      <MenuItem
                        value={item?.tokenId}
                        key={item?.privilegedType}
                      >
                        {item?.privilegedType}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
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
                onClick={mintHandler}
                disabled={!(mintFormik.isValid && mintFormik.dirty) || mintBt}
              >
                {mintBt ? "Minting..." : "Mint"}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
};

const PrivilegeServiceTable = () => {
  const { address } = useAccount();
  const [mintBt, setMintBt] = useState(false);
  const [selectUser, setSelectUser] = useState({});
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [waitListEnteries, setWaitListEnteries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reFetch, setReFetch] = useState(false);
  //fetch waitlist users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getWaitlistEntries"
        );
        console.log("waitListEnteries", response.data.result);
        setWaitListEnteries(response.data.result);
        setTimeout(() => {
          setLoading(false);
          setReFetch(false);
        }, 1000);
      } catch (error) {
        setLoading(false);
        console.log(error);
        if (error.code === "ERR_NETWORK") {
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
        }
      }
    };
    fetchData();
  }, [reFetch]);
  const headers = [
    "S No.",
    "Name",
    "Email",
    "User Address",
    "Privilege Type",
    "Privilege Service",
    "Actions",
  ];
  const handleOpenDialog = (item) => {
    setOpenUserDialog(true);
    setSelectUser(item);
  };
  //deleting user
  const deleteUser = async (userAddress) => {
    const response = await axios.post(
      "http://localhost:5000/api/v1/deleteWaitlistEntry",
      {
        address: userAddress,
      }
    );
    console.log("user-delete res", response);
    if (response.status === 200) {
      setReFetch(true);
    }
  };

  const { write } = useContractWrite({
    address: contractAddress,
    abi: utilityABI,
    functionName: "adminMintPrivileged",
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
      setMintBt(false);
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
        setMintBt(false);
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
          setMintBt(false);
          //closing Dialog
          setOpenUserDialog(false);

          //deleting user
          deleteUser(selectUser.address);
          toast("Re-Fetching Users", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

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
          // setmintBt(false);
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
  const mintHandler = () => {
    setMintBt(true);
    write({
      args: [selectUser.scAddress, selectUser.address],
      from: address,
    });
  };
  return (
    <>
      {loading ? (
        <Box height={"450px"}>
          <Loading />
        </Box>
      ) : (
        <TableContainer
          className="animate__animated animate__zoomIn"
          component={Paper}
          sx={{
            minHeight: "410px",
            maxHeight: "409px",
          }}
        >
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
              {waitListEnteries.length === 0 && (
                <TableRow>
                  <Typography variant="h6" textAlign={"center"}>
                    No Users
                  </Typography>
                </TableRow>
              )}
              {waitListEnteries.length > 0 &&
                waitListEnteries.map((row, index) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "#c3c3c3",
                        color: "white",
                      },
                    }}
                    // onClick={() => handleOpenDialog(row)}
                  >
                    <TableCell onClick={() => handleOpenDialog(row)}>
                      {index + 1}
                    </TableCell>
                    <TableCell onClick={() => handleOpenDialog(row)}>
                      {row.name}
                    </TableCell>
                    <TableCell onClick={() => handleOpenDialog(row)}>
                      {row.email}
                    </TableCell>
                    <TableCell onClick={() => handleOpenDialog(row)}>
                      {row.address}
                    </TableCell>
                    <TableCell onClick={() => handleOpenDialog(row)}>
                      {row.privilegeType}
                    </TableCell>
                    <TableCell onClick={() => handleOpenDialog(row)}>
                      {row.privilegeService}
                    </TableCell>
                    <TableCell
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "white",
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteUser(row.address)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* table mint dialog  */}
      <Dialog
        open={openUserDialog}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Transfer Service Tokens
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="toAddress"
                required
                fullWidth
                id="toAddress"
                label="Address"
                disabled
                value={selectUser?.address}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="type"
                required
                fullWidth
                id="type"
                label="Type"
                value={selectUser?.privilegeType}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="Services"
                required
                fullWidth
                id="quantity"
                label="Service"
                value={selectUser?.privilegeService}
                disabled
              />
            </Grid>
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
                onClick={mintHandler}
                disabled={mintBt}
              >
                {mintBt ? "Transfering..." : "Transfer"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenUserDialog(false)}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {mintBt && (
        <LoadingBackdrop
          state={mintBt}
          description={"Transfering Privilege Service Token"}
        />
      )}
    </>
  );
};

const PrivilegeTypeTable = () => {
  const { address } = useAccount();
  const headers = [
    "S No.",
    "Name",
    "Email",
    "User Address",
    "Message",
    "Actions",
  ];
  const [typeWaitlist, setTypeWaitlist] = useState([]);
  const [privilegeTypes, setPrivilegeTypes] = useState([]);
  const [typeDialog, setTypeDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reFetch, setReFetch] = useState(false);
  const [mintbt, setmintBt] = useState(false);
  const [selectedTypeUser, setSelectedTypeUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/getTypeWaitlistEntries"
        );
        const typesResponse = await axios.get(
          "http://localhost:5000/api/v1/getPrivilegedTypes"
        );
        console.log("getTypeWaitlistEntries", response.data.result);
        console.log("getPrivilegedTypes", typesResponse.data.result);
        setPrivilegeTypes(typesResponse.data.result);
        setTypeWaitlist(response.data.result);
        setReFetch(false);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error);
        setLoading(false);
        if (error.code === "ERR_NETWORK") {
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
        }
      }
    };
    fetchData();
  }, [reFetch]);
  const handleTypeDialogOpen = (item) => {
    setTypeDialog(true);
    setSelectedTypeUser(item);
    typeRequest.values.userAddress = item.address;
  };
  const deleteWaitlistUser = async (userAddr) => {
    setLoading(true);
    const response = await axios.post(
      "http://localhost:5000/api/v1/deleteTypeWaitlistEntry",
      {
        address: userAddr,
      }
    );
    console.log("deleteTypeWaitlistEntry", response);
    setLoading(true);
    setReFetch(true);
    toast("User deleted", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    toast("Re-Fetching Users", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const typeRequest = useFormik({
    initialValues: {
      privilegeType: "",
      userAddress: selectedTypeUser?.address,
    },
    validationSchema: object({
      privilegeType: string().required("Privilege Type Required!"),
    }),
    onSubmit: async (values) => {
      console.log("Formik values", values);
      setmintBt(true);
      // setTimeout(() => {
      //   setmintBt(false);
      // }, 3000);
      //bt state && api call
      write({
        args: [values.userAddress, values.privilegeType, 1],
        from: address,
      });
    },
  });
  const { write } = useContractWrite({
    address: contractAddress,
    abi: utilityABI,
    functionName: "adminMint",
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
      setmintBt(false);
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
        setmintBt(false);
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
          setmintBt(false);

          //setter
          setTypeDialog(false);

          //deleting user
          deleteWaitlistUser(selectedTypeUser?.address);

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
          setmintBt(false);
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
    <>
      {loading ? (
        <Box height={"450px"}>
          <Loading />
        </Box>
      ) : (
        <TableContainer
          className="animate__animated animate__zoomIn"
          component={Paper}
          sx={{
            minHeight: "410px",
            maxHeight: "409px",
          }}
        >
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
              {typeWaitlist.length === 0 && (
                <TableRow>
                  <Typography variant="h6" textAlign={"center"}>
                    No Users
                  </Typography>
                </TableRow>
              )}
              {typeWaitlist.length > 0 &&
                typeWaitlist.map((row, index) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "#c3c3c3",
                        color: "white",
                      },
                    }}
                  >
                    <TableCell onClick={() => handleTypeDialogOpen(row)}>
                      {index + 1}
                    </TableCell>
                    <TableCell onClick={() => handleTypeDialogOpen(row)}>
                      {row.name}
                    </TableCell>
                    <TableCell onClick={() => handleTypeDialogOpen(row)}>
                      {row.email}
                    </TableCell>
                    <TableCell onClick={() => handleTypeDialogOpen(row)}>
                      {row.address}
                    </TableCell>
                    <TableCell onClick={() => handleTypeDialogOpen(row)}>
                      {row.text}
                    </TableCell>
                    <TableCell
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: "white",
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteWaitlistUser(row.address)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* table mint dialog  */}
      <Dialog
        open={typeDialog}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Transfer Type Tokens
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container rowSpacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="userAddress"
                required
                fullWidth
                id="userAddress"
                label="Address"
                disabled
                value={selectedTypeUser?.address}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                variant="outlined"
                autoComplete="given-name"
                name="Services"
                required
                fullWidth
                id="quantity"
                label="Admin Note Ref"
                value={selectedTypeUser?.text}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Select Privilege Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="privilegeType"
                  value={typeRequest.values.privilegeType}
                  onChange={typeRequest.handleChange}
                  error={typeRequest.errors.privilegeType ? true : false}
                  name="privilegeType"
                  required
                  label="Select Privilege Type"
                >
                  {privilegeTypes.map((item, index) => {
                    return (
                      <MenuItem
                        value={item?.tokenId}
                        key={item?.privilegedType}
                      >
                        {item?.privilegedType}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>

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
                onClick={typeRequest.handleSubmit}
                disabled={!(typeRequest.isValid && typeRequest.dirty) || mintbt}
              >
                {mintbt ? "Transfering..." : "Transfer"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setTypeDialog(false)}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {mintbt && (
        <LoadingBackdrop
          state={mintbt}
          description={"Transfering Utility Token"}
        />
      )}
    </>
  );
};
