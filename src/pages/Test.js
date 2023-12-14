import React from "react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Test = () => {
  //fetch jwt
  const jwt = "";
  useEffect(() => {
    if (jwt) {
      return <Outlet />;
    } else {
      return <Navigate to={"/"} replace />;
    }
  }, []);
  return jwt ? <Outlet /> : <Navigate to={"/"} replace />
};

export default Test;
