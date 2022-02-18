import React, { Component } from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { AlertTitle } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={12} ref={ref} variant="filled" {...props} />;
});

export default function AlertsHandler({alertType, setAlertType}) {
  
  function handleCloseAlert(event, reason) {
    if (reason === "clickaway") return;
    setAlertType(null);
  };

  function renderAlert() {
    switch(alertType) {
      case "error":
        return (
          <Snackbar open={alertType === "error"} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical: "bottom", horizontal: "right"}} >
            <Alert onClose={handleCloseAlert} severity="error" sx={{whiteSpace: "nowrap", fontSize: 18}}>
              <AlertTitle style={{fontWeight: "bold"}}>Error</AlertTitle>
              Ha ocurrido un error subiendo el programa.
            </Alert>
          </Snackbar>
        );
      case "success":
        return (
          <Snackbar open={alertType ==="success"} autoHideDuration={4000} onClose={handleCloseAlert} anchorOrigin={{vertical: "bottom", horizontal: "right"}} >
            <Alert onClose={handleCloseAlert} severity="success" sx={{whiteSpace: "nowrap", fontSize: 18}}>
              <AlertTitle style={{fontWeight: "bold"}}>Éxito</AlertTitle>
              Código subido exitosamente.
            </Alert>
          </Snackbar>
        );
      default:
        return null;
    }
  }

  return renderAlert();
};