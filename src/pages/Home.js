import React, { useState, useCallback, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Dashboard from "./Dashboard/Dashboard";
import IframeEnv from "./Simulator/iframeEnv";
import Layout from "../components/Layout/Layout";

import { NotLoggedPage } from "./Login/Login";

export default function Home() {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

  const [token, setToken] = useState(null);
  const [loadingServerStatus, setLoadingServerStatus] = useState(false);
  const [serverRunning, setServerRunning] = useState(false);
  const [currentEnviroment, setCurrentEnviroment] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then((res) => {
        let _token = res.__raw;
        console.log(_token);
        setToken(_token);
      });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  const getServerStatus = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_DOMAIN}${user.email}`;

    try {
      if (token) {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await response.json();
        console.log(json);

        setLoadingServerStatus(false);
        setServerRunning(json.server ? json.servers[""].ready : false);
        setCurrentEnviroment(
          json.server && json.servers[""]
            ? json.servers[""].user_options.profile
            : null
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [user, token]);

  useEffect(() => {
    setLoadingServerStatus(true);
    getServerStatus();
  }, [setLoadingServerStatus, getServerStatus]);

  if (isAuthenticated) {
    return (
      <Layout>
        <Routes>
          <React.Fragment>
            <Route
              exact
              path="/dashboard"
              element={
                <Dashboard
                  user={user}
                  token={token}
                  loadingServerStatus={loadingServerStatus}
                  serverRunning={serverRunning}
                  currentEnviroment={currentEnviroment}
                  setServerRunning={setServerRunning}
                  setCurrentEnviroment={setCurrentEnviroment}
                />
              }
            />
            <Route
              exact
              path="/simulator"
              element={
                <IframeEnv
                  user={user}
                  loadingServerStatus={loadingServerStatus}
                  serverRunning={serverRunning}
                />
              }
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
