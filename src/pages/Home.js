import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, useTheme } from "@mui/material/styles";

import Dashboard from "./Dashboard";
import Layout from "../components/Layout/Layout";


export default function Home() {
  const theme = useTheme();
  // const classes = useStyles(theme);

  return (
    <div>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <div>
        <Layout>
          <Routes>
            <Route exact path="/dashboard" element={<Dashboard/>}/>
            <Route exact path="/simulator" element={<Dashboard/>}/>
            <Route path="/" element={<Navigate replace to="/dashboard" />} />
          </Routes>
          </Layout>
        </div>
      </ThemeProvider>
    </div>
  );
}
