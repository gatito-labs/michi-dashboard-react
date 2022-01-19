// in src/App.js
import * as React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { LoginLanding } from "./pages/Login/Loggin";
import Layout from "./components/Layout/Layout";

function App() {
  const theme = useTheme();

  return (
    <div
      className="App"
      style={{ position: "absolute", height: "100%", width: "100%" }}
    >
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/login/success"
            element={
              <Layout>
                <LoginLanding />
              </Layout>
            }
          />
          <Route path="/*" element={<Home />} /> :
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
