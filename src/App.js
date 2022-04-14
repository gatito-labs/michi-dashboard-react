import * as React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LoginLanding, NotLoggedPage } from "./pages/Login/Login";
import Layout from "./components/Layout/Layout";
import { useAuth0 } from "@auth0/auth0-react";
import { HubServerProvider } from "./store";
import ReactGA from 'react-ga4';
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A6B2FF",
    },
    secondary: {
      main: "#9BCCE8",
    },
  },
});

function App() {
  // const theme = useTheme();
  const { user, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    ReactGA.initialize("G-FHTYXPFZ7N", {
      debug: true,
      titleCase: false,
      gaOptions: {
        userId: user ? user.nickname : "none",
      }
    });
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search
    });
  }, [user]);

  return (
    <div
      className="App"
      style={{ position: "absolute", height: "100%", width: "100%" }}
    >
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <HubServerProvider>
          <Routes>
            <Route
              path="/login/success"
              element={
                <Layout>
                  <LoginLanding />
                </Layout>
              }
            />

            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <Home />
                ) : (
                  <Layout>
                    <NotLoggedPage />
                  </Layout>
                )
              }
            />
          </Routes>
        </HubServerProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
