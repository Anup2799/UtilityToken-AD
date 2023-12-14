import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { Box } from "@mui/material";
import { contractInstance } from "../../configuration/alchemy/alchemy-config";
import { useAccount } from "wagmi";
import ServicesComponent from "../../components/ServicesComponent";
import background from "../../components/assets/service.svg";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import PrivilegeComponent from "../../components/PrivilegeComponent";

const Services = () => {
  const { type } = useParams();
  const [pTypeSix, setPtypeSix] = useState(null);
  const [pTypeSeven, setPtypeSeven] = useState(null);
  const [service1, setService1] = useState(null);
  const [service2, setService2] = useState(null);
  const [service3, setService3] = useState(null);
  const [service4, setService4] = useState(null);
  const [service5, setService5] = useState(null);
  const { address } = useAccount();

  const [loading, setLoading] = useState(false);

  //cached data of Privilege types
  const [pTypes, setPTypes] = useState([]);

  //fetching data
  useEffect(() => {
    // const fetchData = async () => {
    //   setLoading(true);
    //   if (type === "CS1" && address !== undefined) {
    //     const avaiableTokens = await contractInstance.methods
    //       .tokensOwned(address, 1)
    //       .call();
    //     setService1(avaiableTokens);
    //     setLoading(false);
    //   }
    //   if (type === "CS2" && address !== undefined) {
    //     const avaiableTokens = await contractInstance.methods
    //       .tokensOwned(address, 2)
    //       .call();
    //     setService2(avaiableTokens);
    //     setLoading(false);
    //   }
    //   if (type === "CS4" && address !== undefined) {
    //     const avaiableTokens = await contractInstance.methods
    //       .tokensOwned(address, 3)
    //       .call();
    //     setService3(avaiableTokens);
    //     setLoading(false);
    //   }
    //   if (type === "CS5" && address !== undefined) {
    //     const avaiableTokens = await contractInstance.methods
    //       .tokensOwned(address, 4)
    //       .call();
    //     setService4(avaiableTokens);
    //     setLoading(false);
    //   }
    //   if (type === "Privilege" && address !== undefined) {
    //     const avaiableTokens6 = await contractInstance.methods
    //       .tokensOwned(address, 6)
    //       .call();
    //     setPtypeSix(avaiableTokens6);
    //     const avaiableTokens7 = await contractInstance.methods
    //       .tokensOwned(address, 7)
    //       .call();
    //     setPtypeSeven(avaiableTokens7);
    //     console.log("avaiableTokens", avaiableTokens6, avaiableTokens7);
    //     setLoading(false);
    //   }
    // };
    //fetchData();
  }, [address, type]);

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem("P-Types"));
    setPTypes(cachedData);
    console.log("cacheddata", cachedData);
  }, []);
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
          // height:'83vh'
        }}
      >
        {/* <Container maxWidth="lg"> */}
        {/* <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              paddingLeft: isMatch ? " 10px" : "0px",
            }}
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
              Services
            </Typography>
            <Typography
              color="text.primary"
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {type}
            </Typography>
          </Breadcrumbs> */}

        <Box
          sx={{
            pl: 3,
            pr: 3,
          }}
        >
          {type === "CS1" && loading ? (
            <Loading />
          ) : (
            type === "CS1" && (
              <ServicesComponent
                serviceName={"Resturant"}
                tokens={service1}
                imageType={"CS1"}
                typeIndex={1}
              />
            )
          )}
          {type === "CS2" && loading ? (
            <Loading />
          ) : (
            type === "CS2" && (
              <ServicesComponent
                serviceName={"Events"}
                tokens={service2}
                imageType={"CS2"}
                typeIndex={2}
              />
            )
          )}
          {type === "CS4" && loading ? (
            <Loading />
          ) : (
            type === "CS4" && (
              <ServicesComponent
                serviceName={"Water - Games"}
                tokens={service3}
                imageType={"CS4"}
                typeIndex={3}
              />
            )
          )}

          {type === "CS5" && loading ? (
            <Loading />
          ) : (
            type === "CS5" && (
              <ServicesComponent
                serviceName={"Gym"}
                tokens={service4}
                imageType={"CS5"}
                typeIndex={4}
              />
            )
          )}
          {type === "CS6" && loading ? (
            <Loading />
          ) : (
            type === "CS6" && (
              <ServicesComponent
                serviceName={"Car - Rentals"}
                tokens={service5}
                imageType={"CS6"}
                typeIndex={5}
              />
            )
          )}

          {loading && type === "Privilege" ? (
            type === "Privilege" && <Loading />
          ) : (
            <>
              {type === "Privilege" && pTypes?.length > 0 && (
                <PrivilegeComponent
                  // pTypeSeven={pTypeSeven}
                  // pTypeSix={pTypeSix}
                  pTypes={pTypes}
                />
              )}
            </>
          )}
          {/* {loading && type === "Privilege" ? (
            type === "Privilege" && <Loading />
          ) : (
            <>
              {type === "Privilege" &&
                pTypeSix !== null &&
                pTypeSeven !== null && (
                  <PrivilegeComponent
                    pTypeSeven={pTypeSeven}
                    pTypeSix={pTypeSix}
                  />
                )}
            </>
          )} */}
          {/* {loading && type === "Privilege" ? (
            type === "Privilege" && <Loading />
          ) : (
            <>
              {type === "Privilege" &&
                pTypeSix !== null &&
                pTypeSix !== "0" && (
                  <PrivilegeComponent
                    serviceName={"Privilege Service - 1"}
                    tokens={pTypeSix}
                    imageType={"Privilege1"}
                  />
                )}
              {type === "Privilege" &&
                pTypeSeven !== null &&
                pTypeSeven !== "0" && (
                  <PrivilegeComponent
                    serviceName={"Privilege Service - 2"}
                    tokens={pTypeSeven}
                    imageType={"Privilege2"}
                  />
                )}
            </>
          )} */}
        </Box>
        {/* </Container> */}
      </Box>
    </Layout>
  );
};

export default Services;
