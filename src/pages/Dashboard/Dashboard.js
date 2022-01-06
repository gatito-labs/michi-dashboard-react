import React, { useState, useEffect, useCallback, useMemo } from "react";

import EnvCard from "./envCard";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuth0 } from "@auth0/auth0-react";

const SimulationEnviroments = {
  "introduccion-a-la-robotica": {
    name: "introduccion-a-la-robotica",
    title: "Introducción a la Robótica",
    summaryContent: "Aprende a crear un robot seguidor de línea",
    image: `${process.env.PUBLIC_URL}/static/cards/seguidor.png`,
  },

  "brazo-robot": {
    title: "Brazo Robot",
    name: "brazo-robot",
    summaryContent: "Experimenta con un brazo robot",
    image: `${process.env.PUBLIC_URL}/static/cards/brazo.png`,
  },

  "robotica-avanzada": {
    title: "Robótica Avanzada",
    name: "robotica-avanzada",
    summaryContent: "Aprende a crear un mapa a partir de mediciones de rango",
    image: `${process.env.PUBLIC_URL}/static/cards/rosbot.png`,
  },
};

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
  const { user } = useAuth0();
  const [currentEnviroment, setCurrentEnviroment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [serverReady, setServerReady] = useState(null);
  const [serverStarting, setServerStarting] = useState(false);
  const [serverStopping, setServerStopping] = useState(false);

  const [progress, setProgress] = useState(0);
  // const [progressData, setProgressData] = useState(null);

  const ctrl = useMemo(() => new AbortController(), []);

  const startServer = useCallback(
    (env) => {
      // setClicked(true);
      setServerStarting(true);
      setSelectedEnv(env);
      setCurrentEnviroment(env.name);
      setProgress(0);

      fetch(`https://app.gatitolabs.cl/hub/api/users/${user.email}/server`, {
        // content-type header should not be specified!
        method: "POST",
        headers: { Authorization: `token ${process.env.REACT_APP_TOKEN}` },
        body: JSON.stringify({
          profile: env.name,
        }),
      })
        .then((response) => {
          console.log(response);

          fetchEventSource(
            `https://app.gatitolabs.cl/hub/api/users/${user.email}/server/progress`,
            {
              method: "GET",
              headers: {
                Authorization: `token ${process.env.REACT_APP_TOKEN}`,
              },
              signal: ctrl.signal,
              onmessage(msg) {
                //setServerStatus(json.ready);
                //setSpawningStatus(json.progress);
                //console.log(msg.data);
                //var evt = JSON.parse(msg.data);
                console.log(msg.data);
                var progressData = msg.data;

                if (progressData && progressData !== "") {
                  progressData = JSON.parse(progressData);

                  if (progressData.progress) {
                    setProgress(progressData.progress);

                    if (progressData.progress === 100) {
                      setServerStarting(false);
                    }
                  }

                  setServerReady(
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
    [user.email, ctrl]
  );

  const getServerStatus = useCallback(async () => {
    const url = `https://app.gatitolabs.cl/hub/api/users/${user.email}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `token ${process.env.REACT_APP_TOKEN}` },
      });
      const json = await response.json();
      console.log(json);

      setLoading(false);
      setServerReady(json.server ? json.servers[""].ready : false);
      setCurrentEnviroment(
        json.server && json.servers[""]
          ? json.servers[""].user_options.profile
          : null
      );
    } catch (error) {
      console.log("error", error);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    getServerStatus();
  }, [setLoading, getServerStatus]);

  const stopServer = useCallback(() => {
    setServerStopping(true);
    fetch(`https://app.gatitolabs.cl/hub/api/users/${user.email}/server`, {
      // content-type header should not be specified!
      method: "DELETE",
      headers: { Authorization: `token ${process.env.REACT_APP_TOKEN}` },
    })
      .then((response) => console.log(response))
      .then(() => {
        // Do something with the successful response
        setServerStopping(false);
        setServerReady(false);
        setServerStarting(false);
        setSelectedEnv(null);
        setCurrentEnviroment(null);

        ctrl.abort();
      })
      .catch((error) => console.log(error));
  }, [user.email, ctrl]);

  return (
    <div style={{ padding: "1em" }}>
      <Slide direction="right" in={loading} mountOnEnter unmountOnExit>
        <div>
          <Grid
            container
            sx={{ justifyContent: "center", width: "100%", height: "100%" }}
          >
            <Grid item xs={6} sx={{ textAlign: "center", marginBottom: "2em" }}>
              <CircularProgress />
            </Grid>
          </Grid>
          <Divider sx={{ marginBottom: "2em" }} />
        </div>
      </Slide>

      <Slide
        direction="right"
        in={serverStarting && !serverReady}
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
          <Divider sx={{ marginBottom: "2em" }} />
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
          <Divider sx={{ marginBottom: "2em" }} />
        </div>
      </Slide>

      <Grid container spacing={2}>
        {(serverReady || serverStarting) && currentEnviroment ? (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <EnvCard
              active={true}
              envTitle={SimulationEnviroments[currentEnviroment].title}
              summaryContent={
                SimulationEnviroments[currentEnviroment].summaryContent
              }
              expandedContent={
                SimulationEnviroments[currentEnviroment].expandedContent
              }
              envImage={SimulationEnviroments[currentEnviroment].image}
              buttonDisabled={loading || serverStarting || serverStopping}
              stopServer={() => stopServer()}
            />
          </Grid>
        ) : (
          " "
        )}

        {Object.values(SimulationEnviroments).map((env) => {
          if (currentEnviroment !== env.name) {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={env.title}>
                <EnvCard
                  active={env.name === currentEnviroment}
                  envTitle={env.title}
                  summaryContent={env.summaryContent}
                  expandedContent={env.expandedContent}
                  envImage={env.image}
                  buttonDisabled={loading || serverStarting || serverReady}
                  startServer={() => startServer(env)}
                />
              </Grid>
            );
          } else {
            return "";
          }
        })}
      </Grid>
    </div>
  );
};

export default Dashboard;
