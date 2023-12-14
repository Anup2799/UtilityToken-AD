import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDisconnect } from "wagmi";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

const ProtectedRoute = () => {
  //wagmi hook for handling disconnect web3modal
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  //session satte
  const [sessionState, setSessionState] = useState(false);

  //jwt token for decoding
  const jwt = localStorage.getItem("jwtToken");

  //checking for jwt exp time
  useEffect(() => {
    if (jwt) {
      const decode = jwtDecode(jwt);
      if (decode.exp < Date.now() / 1000) {
        setSessionState(true);
        console.log("token Expired");
      } else {
        console.log("not Expired");
      }
    }
  }, [jwt]);

  // notifying the user to connect metamask/.login
  const notify = () => {
    toast.error("Connect Metamask / Login", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    return <Navigate to={"/"} replace />;
  };
  const closeBtHandler = () => {
    setSessionState(false);
    // toast.error("Token Expired", {
    //   position: "top-right",
    //   autoClose: 2000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "dark",
    // });
    disconnect();
    navigate("/auth/Privilege");
    localStorage.removeItem("jwtToken");
  };
  return jwt ? (
    sessionState ? (
      <Dialog
        open={sessionState}
        //onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Session Expired
        </DialogTitle>
        <Divider />
        <DialogContent>
          To protect your account and data, you’ve been automatically logged out
        </DialogContent>
        <DialogActions>
          <Button onClick={closeBtHandler} variant="outlined" color="error">
            Go To Login
          </Button>
        </DialogActions>
      </Dialog>
    ) : (
      <Outlet />
    )
  ) : (
    notify()
  );
};
export default ProtectedRoute;
