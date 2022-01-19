import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
  } else {
    return (
      <Button
        variant="contained"
        type="submit"
        color="primary"
        onClick={loginWithRedirect}
      >
        Ingresar con OAuth
      </Button>
    );
  }
};

export const LoginLanding = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  } else {
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
        {isLoading ? (
          <Grid item>
            <CircularProgress />
          </Grid>
        ) : (
          <React.Fragment>
            <Grid item>
              <Alert severity="error" sx={{ marginBottom: "2em" }}>
                <AlertTitle>Error de Autentificación</AlertTitle>
                Prueba Nuevamente
              </Alert>
            </Grid>
            <Grid item>
              <LoginButton />
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    );
  }
};

export const NotLoggedPage = () => {
  const { isLoading } = useAuth0();
  return (
    <Grid
      container
      direction="column"
      sx={{
        height: "100%",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "3em",
      }}
    >
      {isLoading ? (
        <Grid item>
          <CircularProgress />
        </Grid>
      ) : (
        <React.Fragment>
          <Grid item sx={{marginBottom: "3em"}}>
            <Typography>
              Debes Ingresar para acceder a este contenido
            </Typography>
          </Grid>
          <Grid>
            <LoginButton />
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
};

export default LoginButton;
