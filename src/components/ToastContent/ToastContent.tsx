import React from "react";
import defaultInfo from "../../assets/default-info.svg";
import waringInfo from "../../assets/warning-info.svg";
import tickCircle from "../../assets/tick-circle.svg";
import error from "../../assets/error.svg";
import { Box, Typography } from "@mui/material";
import { pxToRem } from "utils/pxToRem";

const getIcon = (toastType?: string) => {
  switch (toastType) {
    case "success":
      return tickCircle;
    case "error":
      return error;
    case "warning":
      return waringInfo;

    default:
      return defaultInfo;
  }
};
const getTitle = (toastType?: string) => {
  switch (toastType) {
    case "success":
      return "Success";
    case "error":
      return "Error";
    case "warning":
      return "Warning";

    default:
      return "Info";
  }
};

const ToastContent = ({
  toastType,
  message,
}: {
  toastType?: "success" | "error" | "warning";
  message: string;
}) => {
  return (
    <Box display="flex" gap={8} alignItems="center">
      <Box>
        <img src={getIcon(toastType)} alt={toastType || "default"} />
      </Box>
      <Box>
        <Typography variant="body2">{getTitle(toastType)}</Typography>
        <Typography variant="body2" fontSize={pxToRem(12)}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default ToastContent;
