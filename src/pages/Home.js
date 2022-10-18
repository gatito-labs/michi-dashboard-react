import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Dashboard from "./Dashboard";
import IframeEnv from "./Simulator/IframeEnv";
import Layout from "../components/Layout";

import { NotLoggedPage } from "./Login/Login";
import { useHubServer } from "../store";
import Simulator from "./Simulator";
import ReactGA from 'react-ga4';

export default function Home() {
  const { user, isAuthenticated } = useAuth0();
  const { checkServerStatus } = useHubServer();

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);


  if (isAuthenticated && user) {
    ReactGA.set({ userId: user.nickname });
    return (
      <Layout>
        <Routes>
          <React.Fragment>
            <Route exact path="/ambientes" element={<Dashboard />} />
            <Route exact path="/simulador" element={<Simulator />} />
            <Route
              exact
              path="/simulator"
              element={<IframeEnv user={user} />}
            />
            <Route exact path="/" element={<Navigate to="/ambientes" />} />
            <Route
              exact
              path="/dashboard"
              element={<Navigate to="/ambientes" />}
            />
          </React.Fragment>
        </Routes>
      </Layout>
    );
  } else {
    ReactGA.set({ userId: "none" });
    return (
      <Layout>
        <NotLoggedPage />
      </Layout>
    );
  }
}
