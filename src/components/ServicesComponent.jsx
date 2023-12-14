import React, { useState } from "react";
import { Typography, Stack, Box, Button, Breadcrumbs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
//images
import resturant from "../components/assets/resturant.png";
import car from "../components/assets/CAR.png";
import events from "../components/assets/Events.png";
import gym from "../components/assets/GYM.png";
import waterGames from "../components/assets/waterGames.png";
import ps from "../components/assets/privilege.png";
import golf from "../components/assets/GOLF.png";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import {
  contractAddress,
  contractInstance,
  utilityABI,
  web3,
} from "../configuration/alchemy/alchemy-config";
import { useAccount, useContractWrite } from "wagmi";

const ServicesComponent = ({ serviceName, tokens, imageType, typeIndex }) => {
  const [avaiableTokens, setAvaiableTokens] = useState("");
  const [tokenState, setTokenState] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [useBt, setUseBt] = useState(false);
  const { address } = useAccount();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  const getImage = (type) => {
    if (type === "CS1") {
      return resturant;
    }
    if (type === "CS2") {
      return events;
    }
    if (type === "CS4") {
      return waterGames;
    }
    if (type === "CS5") {
      return gym;
    }
    if (type === "CS6") {
      return car;
    }
    if (type === "Privilege1") {
      return ps;
    }
    if (type === "Privilege2") {
      return golf;
    }
  };
  const tokenHandlers = async () => {
    setUseBt(true);
    setQrCode("");
    console.log("case", typeIndex);
    write({
      args: [typeIndex, 1],
      from: address,
    });
  };

  const { write } = useContractWrite({
    address: contractAddress,
    abi: utilityABI,
    functionName: "useTokens",
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

  useEffect(() => {
    const fetchData = async () => {
      const avaiableTokens = await contractInstance.methods
        .tokensOwned(address, typeIndex)
        .call();
      setAvaiableTokens(avaiableTokens);
    };
    fetchData();
  }, [tokenState]);

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

          let data = {
            type: serviceName,
            msg: "give access",
            transactionHash: receipt.transactionHash,
          };
          let stringifyData = JSON.stringify(data);
          QRCode.toDataURL(stringifyData)
            .then((url) => {
              setQrCode(url);
              console.log(url);
            })
            .catch((err) => {
              console.error(err);
            });

          //QR-code generation
          setUseBt(false);
          setTokenState(true); //checking tokens
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
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          color: "white",
          pt: "5px",
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
          onClick={() => navigate("/")}
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
          {serviceName}
        </Typography>
      </Breadcrumbs>
      <Typography
        color={"white"}
        gutterBottom
        // textAlign={"center"}
        variant="h4"
        pt={3}
      >
        {serviceName}
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
            src={getImage(imageType)}
            alt="noting"
            height={"300px"}
            width={"500px"}
          />
        </Box>
        <Box>
          <Typography color={"white"} gutterBottom fontWeight={600}>
            Available Tokens - {avaiableTokens}
          </Typography>
          <Typography color={"white"} gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores,
            enim non. Quas maxime non eligendi, ducimus sit voluptatum, quidem
            porro, quam labore inventore esse laboriosam itaque architecto
            doloremque tempora dicta?
          </Typography>
          <Typography color={"white"} gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores,
            enim non. Quas maxime non eligendi, ducimus sit voluptatum, quidem
            porro, quam labore inventore esse laboriosam itaque architecto
            doloremque tempora dicta?
          </Typography>
          <Stack direction={"row"}>
            {avaiableTokens !== "0" && (
              <Button
                color="error"
                variant="contained"
                disabled={tokens === "0" || useBt || avaiableTokens === "0"}
                onClick={tokenHandlers}
                
                sx={{
                  height: "40px",
                  color:"white"
                }}
              >
                {useBt ? "Processing..." : "Use"}
              </Button>
            )}
            {avaiableTokens === "0" && (
              <>
                <button
                  style={{
                    width: "100px",
                    height: "35px",
                  }}
                  disabled
                >
                  use
                </button>
              </>
            )}
            {qrCode && <img src={qrCode} alt="NO QR-CODE" />}
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default ServicesComponent;
