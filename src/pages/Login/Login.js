import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";

import { EmailNotVerified } from "./VerifyEmail";
import { Button } from "@mui/material";

export const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return <></>;
  } else {
    loginWithRedirect();
    return <></>;
  }
};

export const LoginLanding = () => {
  const { isAuthenticated, isLoading, error, logout } = useAuth0();

  console.log(`Cargando: ${isLoading} - ${isAuthenticated}`);

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
                {error.message} <br />
              </Alert>
            </Grid>
            <Button
              color="primary"
              variant="contained"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Probar de Nuevo
            </Button>
          </React.Fragment>
        )}
      </Grid>
    );
  }
};

export const NotLoggedPage = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();
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
      ) : isAuthenticated && user && !user.email_verified ? (
        <EmailNotVerified />
      ) : (
        <React.Fragment>
          <Grid item sx={{ marginBottom: "3em" }}>
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
