import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import IframeEnv from "./iframeEnv";
import Layout from "../components/Layout/Layout";
import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";

export default function Home() {
  // const classes = useStyles(theme);
  const { isAuthenticated } = useAuth0();

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
        <Typography>Debes Ingresar para acceder a este contenido</Typography>
      )}
    </Layout>
  );
}
