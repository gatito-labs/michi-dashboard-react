import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export const SimStatus = ({on}) => {
  return (
    <FiberManualRecordIcon sx={{ color: on ? "green" : "red" }} />
  );
};
