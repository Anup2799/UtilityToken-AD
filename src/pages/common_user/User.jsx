import React from "react";
import Layout from "../../components/Layout/Layout";
import { Box, Tab, Tabs, Typography, Stack } from "@mui/material";


const User = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };


  return (
    <React.Fragment>
      <Layout>
        {/* <Container> */}
        <Typography align="center" variant="h4">
          Use your Tokens
        </Typography>
        <Box
          sx={{
            marginTop: 3,
            borderBottom: 1,
            borderColor: "divider",
            // display: "flex",
            // justifyContent: "center",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="service-1" {...a11yProps(0)} />
            <Tab label="service-2" {...a11yProps(1)} />
            <Tab label="service-3" {...a11yProps(2)} />
          </Tabs>
        </Box>
        {/* {[1, 2, 3].map((item, index) => {
          return (
            <CustomTabPanel tabValue={tabValue} index={index}>
              <Typography>{item}</Typography>
            </CustomTabPanel>
          );
        })} */}
        <CustomTabPanel tabValue={tabValue} index={0}>
          <Stack direction={"row"}>
            <Typography variant="h6">Avaiable Tokens</Typography>
            <Typography variant="h6">0</Typography>
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel tabValue={tabValue} index={1}>
          <Typography>two</Typography>
        </CustomTabPanel>
        <CustomTabPanel tabValue={tabValue} index={2}>
          <Typography>three</Typography>
        </CustomTabPanel>
        {/* </Container> */}
      </Layout>
    </React.Fragment>
  );
};

export default User;

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
      {tabValue === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};
