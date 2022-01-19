import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Dashboard from "./Dashboard/Dashboard";
import IframeEnv from "./iframeEnv";
import Layout from "../components/Layout/Layout";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

export default function Home() {
  // const classes = useStyles(theme);
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <Layout>
      {isAuthenticated ? (
        <Routes>
          <React.Fragment>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/simulator" element={<IframeEnv />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </React.Fragment>
        </Routes>
      ) : (
        <Grid
          container
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "60%",
          }}
        >
          <Grid item>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Typography>
                Debes Ingresar para acceder a este contenido
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}
