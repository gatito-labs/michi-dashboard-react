import React, { useState, useEffect, useCallback } from "react";

import EnvCard from "../components/envCard";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import LinearProgress from "@mui/material/LinearProgress";

import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { user } = useAuth0();

  const [selectedEnv, setSelectedEnv] = useState(null);
  const [started, setStarted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [serverReady, setServerReady] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressData, setProgressData] = useState(null);
  const [stopRequest, setstopRequest] = useState(false);

  const ctrl = new AbortController();

  const startServer = (env) => {
    // setClicked(true);
    setStarted(true);
    setSelectedEnv(env);

    fetch(`https://app.gatitolabs.cl/hub/api/users/${user.email}/server`, {
      // content-type header should not be specified!
      method: "POST",
      headers: { Authorization: `token ${process.env.REACT_APP_TOKEN}` },
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
              setProgressData(msg.data);
            },
          }
        );
      })
      .catch((error) => {
        console.log(error);
        setStarted(false);
      });
  };

  const getServerStatus = useCallback(async () => {
    const url = `https://app.gatitolabs.cl/hub/api/users/${user.email}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `token ${process.env.REACT_APP_TOKEN}` },
      });
      const json = await response.json();
      //console.log(json.servers[''].ready);

      setServerReady(json.server ? json.servers[""].ready : false);
    } catch (error) {
      console.log("error", error);
    }
  }, [user]);

  useEffect(() => {
    console.log("use effect");
    if (progressData && progressData !== "") {

      var progressDataParsed = JSON.parse(progressData);

      if (progressDataParsed.progress) {
        setProgress(progressDataParsed.progress);
      }

      setServerReady(progressDataParsed.ready ? progressDataParsed.ready : false);
    } else {
      getServerStatus();
    }
  }, [progressData, getServerStatus]);

  const stopServer = () => {
    setstopRequest(true);
    fetch(`https://app.gatitolabs.cl/hub/api/users/${user.email}/server`, {
      // content-type header should not be specified!
      method: "DELETE",
      headers: { Authorization: `token ${process.env.REACT_APP_TOKEN}` },
    })
      .then((response) => console.log(response))
      .then((success) => {
        // Do something with the successful response
        setstopRequest(false);
        ctrl.abort();
        setProgressData("");
      })
      .catch((error) => console.log(error));
  };
  // React.useEffect(() => {
  //   if (started) {
  //     const timer = setInterval(() => {
  //       setProgress((oldProgress) => {
  //         if (oldProgress === 100) {
  //           return 0;
  //         }
  //         const diff = Math.random() * 10;
  //         return Math.min(oldProgress + diff, 100);
  //       });
  //     }, 500);

  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }
  // }, [started]);

  return (
    <div style={{padding: "1em"}}>
      <Slide
        direction="right"
        in={started && !serverReady}
        mountOnEnter
        unmountOnExit
      >
        <Grid
          container
          sx={{ justifyContent: "center", width: "100%", height: "100%" }}
        >
          <Grid item xs={6}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography sx={{ marginTop: "2em" }}>
              {" "}
              Iniciando ambiente: {selectedEnv}{" "}
            </Typography>
          </Grid>
        </Grid>
      </Slide>

      {serverReady && (
        <Grid container direction="row" sx={{ justifyContent: "center", width: "100%", height: "100%" }} spacing={2}>
          <Grid item>
            {" "}
            <Button variant="contained" color="success"> Server Ready </Button>
          </Grid>

          <Grid item>
            <Button variant="contained" color="error" onClick={stopServer}> Stop </Button>

          </Grid>
        </Grid>
      )}

      {!started && !serverReady && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <EnvCard
              envTitle="Introducción a la Robótica"
              summaryContent={
                <Typography>
                  Aprende a programar un simple robot con ruedas
                </Typography>
              }
              expandedContent={<Typography> Extra Extra ... </Typography>}
              envImage={`${process.env.PUBLIC_URL}/static/cards/gato1.jpg`}
              start={startServer}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <EnvCard
              envTitle="Brazo Robot"
              summaryContent={
                <Typography>Experimenta con un brazo robot</Typography>
              }
              expandedContent={<Typography> Extra Extra ... </Typography>}
              envImage={`${process.env.PUBLIC_URL}/static/cards/gato2.jpeg`}
              start={startServer}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <EnvCard
              envTitle="Robótica Avanzada"
              summaryContent={
                <Typography>
                  Aprende a crear un mapa a partir de mediciones de rango
                </Typography>
              }
              expandedContent={<Typography> Extra Extra ... </Typography>}
              envImage={`${process.env.PUBLIC_URL}/static/cards/gato2.jpeg`}
              start={startServer}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default Dashboard;
