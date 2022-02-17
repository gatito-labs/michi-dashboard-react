import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Dashboard from "./Dashboard";
import IframeEnv from "./Simulator/IframeEnv";
import Layout from "../components/Layout";

import { NotLoggedPage } from "./Login/Login";
import { useHubServer } from "../store";

export default function Home() {
  const { user, isAuthenticated } = useAuth0();
  const { checkServerStatus } = useHubServer();

  useEffect(() => {
    checkServerStatus();
  }, [checkServerStatus]);

  if (isAuthenticated) {
    return (
      <Layout>
        <Routes>
          <React.Fragment>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route
              exact
              path="/simulator"
              element={<IframeEnv user={user} />}
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </React.Fragment>
        </Routes>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <NotLoggedPage />
      </Layout>
    );
  }
}
