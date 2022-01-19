// import * as React from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Iframe from "react-iframe";
import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";

const IframeEnv = ({ user, loadingServerStatus, serverRunning }) => {
  if (loadingServerStatus || !serverRunning) {
    return (
      <Grid
        container
        direction="column"
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "3em",
        }}
      >
        {loadingServerStatus ? (
          <Grid item>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid item>
            <Alert severity="error" sx={{ marginBottom: "2em" }}>
              No hay ningún ambiente de simulación corriendo, debes iniciar un ambiente en "Mis Ambientes".
            </Alert>
          </Grid>
        )}
      </Grid>
    );
  } else {
    return (
      <Iframe
        title="test"
        src={`https://app.gatitolabs.cl/user/${user.email}/`}
        frameborder="0"
        height="100%"
        width="100%"
      />
    );
  }
};

export default IframeEnv;
