import { Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const BreadcrumbsCompo = ({
  mainPage,
  recentPage,
  navigateTo,
  colorScheme,
}) => {
  const navigate = useNavigate();
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        color: colorScheme,
        pt: 1,
      }}
    >
      <Typography
        sx={{
          textDecoration: "underline",
          "&:hover": {
            cursor: "pointer",
          },
        }}
        color={colorScheme}
        onClick={() => navigate(navigateTo)}
      >
        {recentPage}
      </Typography>
      <Typography
        color={colorScheme}
        sx={{
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        {mainPage}
      </Typography>
    </Breadcrumbs>
  );
};

export default BreadcrumbsCompo;
