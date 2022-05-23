import React, { useEffect, useState } from "react";

import ActiveCard from "./ActiveCard";
import BuyCard from "./BuyCard";
import EnvCard from "./EnvCard";
import Footer from "../../components/Layout/Footer";
import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";

import { useHubServer } from "../../store";
import { useTheme } from "@mui/styles";
import ReactGA from "react-ga4";
import { Link } from "react-router-dom";

const DividerTitle = ({ children }) => {
  const theme = useTheme();
  return (
    <Divider
      color="primary"
      sx={{
        margin: "2em",
        "&::before": { width: "2%", borderColor: theme.palette.primary.light },
        "&::after": { borderColor: theme.palette.primary.light },
      }}
      textAlign="left"
      variant="middle"
    >
      <Chip
        color="primary"
        label={
          <Typography color="white" variant="subtitle2">
            {children}
          </Typography>
        }
      ></Chip>
    </Divider>
  );
};

const Dashboard = () => {
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });
  }, []);

  const {
    serverRunning,
    startingServer: serverStarting,
    stopingServer: serverStopping,
    startingServerProgress,
    loadingStatus,
    runningEnviroment,
    clearErrors,
    startServer,
    stopServer,
    serverError,
    availableEnviroments,
    availableCoursesToBuy,
    getAvailableEnviroments,
    gettingEnviroments,
  } = useHubServer();

  const [selectedEnv, setSelectedEnv] = useState(null);

  useEffect(() => {
    getAvailableEnviroments();
  }, [getAvailableEnviroments]);

  return (
    <div style={{ padding: "1em" }}>
      <Slide
        direction="right"
        in={serverError !== null}
        mountOnEnter
        unmountOnExit
      >
        <Grid item xl={6} md={6} sm={9} sx={{ margin: "1em auto" }}>
          <Alert severity="error" onClose={clearErrors}>
            {serverError}
          </Alert>
        </Grid>
      </Slide>

      <Slide direction="right" in={loadingStatus} mountOnEnter unmountOnExit>
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

      <DividerTitle>Mis Ambientes</DividerTitle>

      <Slide
        direction="right"
        in={serverRunning && runningEnviroment !== null && !serverStopping}
        mountOnEnter
        unmountOnExit
        style={{marginBottom: "1em"}}
      >
        <Grid container>
          <Grid item xl={6} md={8} xs={12}>
            {runningEnviroment !== null &&
              availableEnviroments !== null &&
              availableEnviroments[runningEnviroment] && (
                <ActiveCard
                  active={serverRunning || serverStarting}
                  envTitle={availableEnviroments[runningEnviroment].title}
                  description={
                    availableEnviroments[runningEnviroment].summaryContent
                  }
                  expandedContent={
                    availableEnviroments[runningEnviroment].expandedContent
                  }
                  envImage={availableEnviroments[runningEnviroment].img_url}
                  buttonDisabled={
                    loadingStatus || serverStarting || serverStopping
                  }
                  stopServer={() => stopServer()}
                />
              )}
          </Grid>
        </Grid>
      </Slide>

      {gettingEnviroments ? (
        <Grid
          container
          sx={{ justifyContent: "center", width: "100%", height: "100%" }}
        >
          <Grid item xs={6} sx={{ textAlign: "center", marginBottom: "2em" }}>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : availableEnviroments === null ||
        Object.keys(availableEnviroments).length === 0 ? (
        <Grid item xl={6} md={6} sm={9} sx={{ margin: "auto" }}>
          <Alert severity="info">
            No hay ambientes disponibles. Aún no has comprado ningún curso o no
            has sido añadido a un taller. Si eres parte de un taller, añade el
            código asociado en el siguiente{" "}
            <Link to="/curso_codigo">link </Link>.
          </Alert>
        </Grid>
      ) : (
        availableEnviroments && (
          <Grid
            container
            spacing={2}
            sx={{ alignItems: "stretch" }}
            id="available-enviroments"
          >
            {Object.values(availableEnviroments).map((env) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={env.title}
                  className="available-enviroment"
                >
                  <EnvCard
                    active={env.name === runningEnviroment}
                    envTitle={env.title}
                    description={env.summary}
                    envImage={env.img_url}
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
        )
      )}

      {availableCoursesToBuy !== null &&
      availableCoursesToBuy !== undefined &&
      Object.keys(availableCoursesToBuy).length !== 0 ? (
        <>
          <DividerTitle>Tienda</DividerTitle>

          <Grid
            container
            spacing={2}
            sx={{ alignItems: "stretch" }}
            id="course-store"
          >
            {Object.values(availableCoursesToBuy).map((course) => {
              return (
                <Grid
                  key={course.title}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="available-course-to-buy"
                >
                  <BuyCard course={course} />
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <></>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
