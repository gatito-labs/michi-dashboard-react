import React from "react";

import Button from "@mui/material/Button";
import { useHubServer } from "../../store";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";


export const SimStatus = () => {
  const { serverRunning } = useHubServer();
  return (
    <FiberManualRecordIcon sx={{ color: serverRunning ? "green" : "red" }} />
  );
};
