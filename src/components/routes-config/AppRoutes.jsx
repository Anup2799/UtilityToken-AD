import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Admin from "../../pages/admin/Admin";
import User from "../../pages/common_user/User";
import Auth from "../../pages/Auth/Auth";
import RequestingServices from "../../pages/common_user/RequestingServices";
import CustomerLandingScreen from "../../pages/Landing/CustomerLandingScreen";
import Rooms from "../../pages/Booking/Rooms";
import RoomBooking from "../../pages/Booking/RoomBooking";
import Services from "../../pages/common_user/Services";
import ProtectedRoute from "./ProtectedRoute";
import NotUser from "../../pages/Extra/NotUser";
import Test from "../../pages/Test";
import PSComponent from "../PSComponent";
import StandardServices from "../../pages/Services/StandardServices";
import PrivilegeServices from "../../pages/Services/PrivilegeServices";
import NotFound from "../../pages/Extra/NotFound";
import Home from "../../pages/Landing/Home";
import ServiceManager from "../../pages/admin/ServiceManager";

const AppRoutes = () => {
  const location = useLocation();
  return (
    <React.Fragment>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/customer" element={<CustomerLandingScreen />} />
        {/* <Route path="/admin" element={<ServiceManager />} /> */}
        <Route path="/admin" element={<Admin />} />
        {/* <Route path="/auth" element={<Auth />} /> */}
        <Route path="/user" element={<User />} />
        <Route path="/not-privilege-user" element={<NotUser />} />
        <Route path="/test" element={<Test />} />
        <Route path="/common-services" element={<StandardServices />} />
        <Route path="/privilege-services" element={<PrivilegeServices />} />
        {/* <Route path="/test" element={<ServicesComponent />} /> */}

        {/* booking */}
        <Route path="/auth/:serviceTye" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/request-service/" element={<RequestingServices />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/services/:type" element={<Services />} />
          <Route path="/services/:type/:ptType/:psType/:contract" element={<PSComponent />} />
          <Route path="/room-booking" element={<RoomBooking />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Fragment>
  );
};

export default AppRoutes;
