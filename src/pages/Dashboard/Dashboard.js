import React, { useState, useEffect } from "react";

import EnvCard from "./EnvCard";
import ActiveCard from "./ActiveCard";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { useHubServer } from "../../store";

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

const Dashboard = () => {
  const {
    serverRunning,
    startingServer: serverStarting,
    stopingServer: serverStopping,
    startingServerProgress,
    loadingStatus,
    runningEnviroment,
    startServer,
    stopServer,
  } = useHubServer();

  
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [simulationEnviroments, setSimulationEnviroments] = useState(null);

  useEffect(() => {
    fetch("./enviroments.json").then((res) => {
      res.json().then((envs) => {
        setSimulationEnviroments(envs);
      });
    });
  }, []);

  return (
    <div style={{ padding: "1em" }}>
      <Slide
        direction="right"
        in={loadingStatus}
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
              <CircularProgressWithLabel value={startingServerProgress} />
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
        in={serverRunning && runningEnviroment !== null && !serverStopping}
        mountOnEnter
        unmountOnExit
      >
        <Grid container>
          <Grid item xl={6} md={8} xs={12}>
            {runningEnviroment !== null &&
              simulationEnviroments !== null &&
              simulationEnviroments[runningEnviroment] && (
                <ActiveCard
                  active={serverRunning || serverStarting}
                  envTitle={simulationEnviroments[runningEnviroment].title}
                  summaryContent={
                    simulationEnviroments[runningEnviroment].summaryContent
                  }
                  expandedContent={
                    simulationEnviroments[runningEnviroment].expandedContent
                  }
                  envImage={simulationEnviroments[runningEnviroment].image}
                  buttonDisabled={
                    loadingStatus || serverStarting || serverStopping
                  }
                  stopServer={() => stopServer()}
                />
              )}
          </Grid>
        </Grid>
      </Slide>
      {(loadingStatus ||
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
                  active={env.name === runningEnviroment}
                  envTitle={env.title}
                  summaryContent={env.summaryContent}
                  expandedContent={env.expandedContent}
                  envImage={env.image}
                  buttonDisabled={
                    loadingStatus || serverStarting || serverRunning
                  }
                  startServer={() => {
                    setSelectedEnv(env);
                    startServer(env);
                  }}
                />
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default Dashboard;
