import React from "react";
import WagmiWrapper from "./configuration/wagmi/WagmiConfiguration";
import ContextWrapper from "./components/context/ContextApi";
import Header from "./components/Header/Header";
import AppRoutes from "./components/routes-config/AppRoutes";
import 'animate.css';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressBar from "./components/top-progressBar/ProgressBar";
import ThemeWrapper from "./components/Theme/ThemeWrapper";

// import './App.css';

function App() {

  return (
    <React.Fragment>
      <WagmiWrapper>
        <ThemeWrapper>
          <ContextWrapper>
            <Header />
            <ProgressBar />
            <AppRoutes />
            <ToastContainer />
          </ContextWrapper>
        </ThemeWrapper>
      </WagmiWrapper>
    </React.Fragment>
  );
}

export default App;
