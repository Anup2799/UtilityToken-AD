import React, { useEffect } from "react";
import Layout from "./Layout/Layout";
import BreadcrumbsCompo from "./BreadcrumbsCompo";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import image1 from "../components/assets/Events.png";
import background from "../components/assets/service.svg";
import { web3 } from "../configuration/alchemy/alchemy-config";
import privilegeABI from "../contracts/privilegeABI.json";
import { useAccount, useContractWrite } from "wagmi";
import { useState } from "react";
import Loading from "./Loading/Loading";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { object } from "yup";
import { useFormik } from "formik";
import axios from "axios";
import LoadingBackdrop from "./Loading/LoadingBackdrop";
const PSComponent = () => {
  const navigate = useNavigate();
  const [userNFTDetails, setUserNFTDetails] = useState([]);
  const [userTokenIDs, setUserTokenIDs] = useState([]);
  const { address } = useAccount();
  const { psType, contract, ptType } = useParams();
  const [avaiableTokens, SetAvaiableTokens] = useState(null);
  const [ownedToken, SetOwnedTokes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogState, setDialogState] = useState(false);
  const [requestState, setRequestState] = useState(false);
  const [useBt, setUseBt] = useState(false);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      if (address) {
        //contract instance
        setLoading(true);
        const instance = new web3.eth.Contract(privilegeABI, contract);
        const avaiableToken = await instance.methods.balanceOf(address).call();
        const MAX_SALE = await instance.methods.MAX_SALE().call();
        const totalSupply = await instance.methods.totalSupply().call();
        SetOwnedTokes(avaiableToken);
        console.log("avaiableToken", avaiableToken);
        SetAvaiableTokens(MAX_SALE - totalSupply);
        setLoading(false);
      }

      try {
        const options = {
          method: "GET",
          url: "https://polygon-mumbai.g.alchemy.com/v2/8kbfGe4lz8I7NRg5PbtvkJG1Fw7Rz6iu/getNFTsForOwner",
          params: {
            owner: address,
            "contractAddresses[]": contract,
            withMetadata: "true",
            pageSize: "100",
          },
          headers: { accept: "application/json" },
        };

        const response = await axios.request(options);
        console.log("user NFT details", response.data?.ownedNfts);
        setUserNFTDetails(response.data.ownedNfts);
        const ar = response.data.ownedNfts;
        let tokenIds = [];
        const hexToDecimal = (hex) => parseInt(hex, 16);
        for (let i = 0; i < ar.length; i++) {
          tokenIds.push(hexToDecimal(ar[i].id?.tokenId));
        }

        setUserTokenIDs(tokenIds);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContract();
  }, [address, contract, refetch]);

  const requestNewPS = useFormik({
    initialValues: {
      userName: localStorage.getItem("loggedUser").split("@")[0],
      email: localStorage.getItem("loggedUser"),
      address: address,
      psType: psType,
      privilegeType: ptType,
    },
    validationSchema: object({
      //userName: string().required("User Name Required!"),
      // email: string().email("Invalid Email Format").required("Email required!"),
    }),
    onSubmit: async (values) => {
      console.log("Formik values", values);

      //bt state && api call
      //setRequestState(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/saveWaitlistEntries",
          {
            privilegeService: values.psType,
            address: values.address,
            email: values.email,
            name: values.userName,
            privilegeType: values.privilegeType,
            scAddress: contract,
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
        //setReqBtState(false);
        setDialogState(false); // ps dialog state
      } catch (error) {
        console.log(error);
        //setReqBtState(false);
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

  const handleBurn = () => {
    setUseBt(true);
    burnTransaction.write({
      args: [userTokenIDs[0]],
      from: address,
    });
  };

  const burnTransaction = useContractWrite({
    address: contract,
    abi: privilegeABI,
    functionName: "Burn",
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
      setUseBt(false);
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
        setUseBt(false);
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
          setUseBt(false);
          setRefetch(true);

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
          setUseBt(false);

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
      setUseBt(false);
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

  return (
    <Layout>
      <Box
        height={{
          xs: "110vh",
          md: "100vh",
          sm: "100vh",
          lg: "83vh",
          xl: "90vh",
        }}
        style={{
          backgroundImage: `url(${background})`,
          color: "white",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            <BreadcrumbsCompo
              mainPage={`${psType}`}
              recentPage={"Privilege Services"}
              navigateTo={"/services/Privilege"}
              colorScheme={"white"}
            />
            <Typography
              color={"white"}
              gutterBottom
              // textAlign={"center"}
              variant="h4"
              pt={3}
            >
              {psType}
            </Typography>
            <Stack
              direction={{
                xs: "column",
                md: "row",
                sm: "column",
                xl: "row",
                lg: "row",
              }}
              justifyContent={"space-between"}
              gap={2}
              mt={1}
            >
              <Box>
                <img
                  src={image1}
                  alt="noting"
                  height={"300px"}
                  width={"500px"}
                />
              </Box>
              <Box>
                <Stack direction={"row"} gap={5}>
                  <Typography color={"white"} gutterBottom fontWeight={600}>
                    Avaiable Tokens - {avaiableTokens}
                  </Typography>
                  <Typography color={"white"} gutterBottom fontWeight={600}>
                    Owned Tokens - {ownedToken}
                  </Typography>
                  <Typography color={"white"} gutterBottom fontWeight={600}>
                    TokenId - {userTokenIDs[0]}
                  </Typography>
                </Stack>
                <Typography color={"white"} gutterBottom>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maiores, enim non. Quas maxime non eligendi, ducimus sit
                  voluptatum, quidem porro, quam labore inventore esse
                  laboriosam itaque architecto doloremque tempora dicta?
                </Typography>
                <Typography color={"white"} gutterBottom>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Maiores, enim non. Quas maxime non eligendi, ducimus sit
                  voluptatum, quidem porro, quam labore inventore esse
                  laboriosam itaque architecto doloremque tempora dicta?
                </Typography>
                {ownedToken !== "0" ? (
                  <Button
                    variant="contained"
                    onClick={handleBurn}
                    disabled={useBt}
                  >
                    Use
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      // navigate("/request-service")
                      setDialogState(true);
                    }}
                    startIcon={<AddIcon />}
                  >
                    Request
                  </Button>
                )}
              </Box>
            </Stack>
          </>
        )}
      </Box>

      <Dialog
        open={dialogState}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          <Typography textAlign={"center"} gutterBottom variant="h5">
            Privilege Service Request
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Container
            maxWidth="md"
            component={Paper}
            elevation={5}
            sx={{
              p: 2,
            }}
          >
            {/* <Typography textAlign={"center"} gutterBottom variant="h5">
            Privilege Service Request
          </Typography> */}
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="userName"
                  name="userName"
                  label="User Name"
                  value={requestNewPS.values.userName}
                  // onChange={requestNewPS.handleChange}
                  // helperText={requestNewPS.errors.userName}
                  // error={requestNewPS.errors.userName ? true : false}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="psType"
                  name="psType"
                  label="Privilege Service"
                  value={requestNewPS.values.psType}
                  disabled
                  // onChange={requestNewPS.handleChange}
                  // helperText={requestNewPS.errors.userName}
                  // error={requestNewPS.errors.userName ? true : false}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <TextField
                  variant="outlined"
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="privilegeType"
                  name="privilegeType"
                  label="Privilege Type"
                  value={requestNewPS.values.privilegeType}
                  disabled
                  // onChange={requestNewPS.handleChange}
                  // helperText={requestNewPS.errors.userName}
                  // error={requestNewPS.errors.userName ? true : false}
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
                  onClick={requestNewPS.handleSubmit}
                  disabled={requestState}
                >
                  {requestState ? "Requesting..." : "Request"}
                </Button>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogState(false)}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {useBt && (
        <LoadingBackdrop
          state={useBt}
          description={`Burning Token Id- ${userTokenIDs[0]}`}
        />
      )}
    </Layout>
  );
};

export default PSComponent;
