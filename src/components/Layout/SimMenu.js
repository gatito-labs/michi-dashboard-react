import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useHubServer } from "../../store";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

export const SimButton = ({ onClick }) => {
  const { serverRunning } = useHubServer();

  return (
    <Button
      sx={{
        mx: 3,
        color: "white",        
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
      onClick={serverRunning ? onClick : () => {}}
    >
      {"Simulador "}
      <FiberManualRecordIcon sx={{ color: serverRunning ? "green" : "red" }} />
    </Button>
  );
};

export const SimMenu = () => {
//   const { serverRunning, restartServer, stopServer } = useHubServer();

  return (
    <React.Fragment>
      <MenuItem>
        <Typography>Reiniciar Ambiente</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>Detener Ambiente</Typography>
      </MenuItem>
    </React.Fragment>
  );
};
