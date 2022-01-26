import React, { useState, useCallback, useMemo, useEffect } from "react";

import EnvCard from "./envCard";
import ActiveCard from "./activeCard";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchEventSource } from "@microsoft/fetch-event-source";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const Dashboard = ({
  user,
  token,
  serverRunning,
  loadingServerStatus,
  currentEnviroment,
  setCurrentEnviroment,
  setServerRunning,
}) => {
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [serverStarting, setServerStarting] = useState(false);
  const [serverStopping, setServerStopping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simulationEnviroments, setSimulationEnviroments] = useState(null);

  const ctrl = useMemo(() => new AbortController(), []);

  useEffect(() => {
    fetch("./enviroments.json").then((res) => {
      res.json().then((envs) => {
        setSimulationEnviroments(envs);
      });
    });
  }, []);

  const startServer = useCallback(
    async (env) => {
      setServerStarting(true);
      setSelectedEnv(env);
      setCurrentEnviroment(env.name);
      setProgress(0);

      fetch(`${process.env.REACT_APP_API_DOMAIN}${user.email}/server`, {
        // content-type header should not be specified!
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          profile: env.name,
        }),
      })
        .then(() => {
          fetchEventSource(
            `${process.env.REACT_APP_API_DOMAIN}${user.email}/server/progress`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: ctrl.signal,
              onmessage(msg) {
                var progressData = msg.data;

                if (progressData && progressData !== "") {
                  progressData = JSON.parse(progressData);

                  if (progressData.progress) {
                    setProgress(progressData.progress);

                    if (progressData.progress === 100) {
                      setServerStarting(false);
                    }
                  }

                  setServerRunning(
                    progressData.ready ? progressData.ready : false
                  );
                }
              },
            }
          );
        })
        .catch((error) => {
          console.log(error);
          // setServerLoading(false);
        });
    },
    [user.email, ctrl, token, setCurrentEnviroment, setServerRunning]
  );

  const stopServer = useCallback(async () => {
    setServerStopping(true);

    fetch(`${process.env.REACT_APP_API_DOMAIN}${user.email}/server`, {
      // content-type header should not be specified!
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        // Do something with the successful response
        setServerStopping(false);
        setServerRunning(false);
        setServerStarting(false);
        setSelectedEnv(null);
        setCurrentEnviroment(null);
        ctrl.abort();
      })
      .catch((error) => console.log(error));
  }, [user.email, ctrl, token, setServerRunning, setCurrentEnviroment]);

  return (
    <div style={{ padding: "1em" }}>
      <Slide
        direction="right"
        in={loadingServerStatus}
        mountOnEnter
        unmountOnExit
      >
        <div>
          <Grid
            container
            sx={{ justifyContent: "center", width: "100%", height: "100%" }}
          >
            <Grid item xs={6} sx={{ textAlign: "center", marginBottom: "2em" }}>
              <CircularProgress />
            </Grid>
          </Grid>
        </div>
      </Slide>

      <Slide
        direction="right"
        in={serverStarting && !serverRunning}
        mountOnEnter
        unmountOnExit
      >
        <div>
          <Grid
            container
            sx={{ justifyContent: "center", width: "100%", height: "100%" }}
          >
            <Grid item xs={6} sx={{ textAlign: "center", marginBottom: "2em" }}>
              <CircularProgressWithLabel value={progress} />
              <Typography sx={{ marginTop: "1em" }}>
                Iniciando ambiente:{" "}
                {selectedEnv !== null ? selectedEnv.title : ""}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Slide>

      <Slide direction="right" in={serverStopping} mountOnEnter unmountOnExit>
        <div>
          <Grid
            container
            sx={{ justifyContent: "center", width: "100%", height: "100%" }}
          >
            <Grid item xs={6} sx={{ textAlign: "center", marginBottom: "1em" }}>
              <CircularProgress color="error" />
              <Typography sx={{ marginTop: "1em" }}>
                Deteniendo Ambiente
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Slide>
      <Slide
        direction="right"
        in={serverRunning && currentEnviroment !== null && !serverStopping}
        mountOnEnter
        unmountOnExit
      >
        <Grid container>
          <Grid item xl={6} md={8} xs={12}>
            {currentEnviroment !== null &&
              simulationEnviroments !== null &&
              simulationEnviroments[currentEnviroment] && (
                <ActiveCard
                  active={serverRunning || serverStarting}
                  envTitle={simulationEnviroments[currentEnviroment].title}
                  summaryContent={
                    simulationEnviroments[currentEnviroment].summaryContent
                  }
                  expandedContent={
                    simulationEnviroments[currentEnviroment].expandedContent
                  }
                  envImage={simulationEnviroments[currentEnviroment].image}
                  buttonDisabled={
                    loadingServerStatus || serverStarting || serverStopping
                  }
                  stopServer={() => stopServer()}
                />
              )}
          </Grid>
        </Grid>
      </Slide>
      {(loadingServerStatus ||
        serverRunning ||
        serverStarting ||
        serverStopping) && <Divider sx={{ margin: "2em" }} />}

      <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
        {simulationEnviroments &&
          Object.values(simulationEnviroments).map((env) => {
            // if (currentEnviroment !== env.name) {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={env.title}>
                <EnvCard
                  active={env.name === currentEnviroment}
                  envTitle={env.title}
                  summaryContent={env.summaryContent}
                  expandedContent={env.expandedContent}
                  envImage={env.image}
                  buttonDisabled={
                    loadingServerStatus || serverStarting || serverRunning
                  }
                  startServer={() => startServer(env)}
                />
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default Dashboard;
