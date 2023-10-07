import React from "react";
import { Box } from "@mui/material";
import backAuth from "assets/back-auth.svg";
import docuplierLogo from "assets/doclogo.svg";
const Login = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      sx={{ backgroundColor: "#0B0D27" }}
    >
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          src={backAuth}
          alt="backgroundImage"
          width="472px"
          height="689px"
        />
        <Box
          // px={20}
          py={8}
          width="572px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img src={docuplierLogo} />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
