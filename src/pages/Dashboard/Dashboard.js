import React, { useEffect, useState } from "react";

import ActiveCard from "./ActiveCard";
import BuyCard from "./BuyCard";
import EnvCard from "./EnvCard";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import CircularProgressWithLabel from "../../components/CircularProgressWithLabel";
import { useHubServer } from "../../store";
import ReactGA from "react-ga4";
import { useTheme } from "@mui/styles";
import Footer from "../../components/Layout/Footer";

const DividerTitle = ({ children }) => {
  const theme = useTheme();
  return (
    <Divider
      sx={{ margin: "2em", "&::before": { width: "2%" } }}
      textAlign="left"
      variant="middle"
    >
      <Typography variant="subtitle1" color={theme.palette.primary.dark}>
        {children}
      </Typography>
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
  } = useHubServer();

  const [selectedEnv, setSelectedEnv] = useState(null);

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

      {/* {(loadingStatus ||
        serverRunning ||
        serverStarting ||
        serverStopping ||
        serverError) && 
      } */}

      <Slide
        direction="right"
        in={serverRunning && runningEnviroment !== null && !serverStopping}
        mountOnEnter
        unmountOnExit
      >
        <Grid container>
          <Grid item xl={6} md={8} xs={12}>
            {runningEnviroment !== null &&
              availableEnviroments !== null &&
              availableEnviroments[runningEnviroment] && (
                <ActiveCard
                  active={serverRunning || serverStarting}
                  envTitle={availableEnviroments[runningEnviroment].title}
                  summaryContent={
                    availableEnviroments[runningEnviroment].summaryContent
                  }
                  expandedContent={
                    availableEnviroments[runningEnviroment].expandedContent
                  }
                  envImage={availableEnviroments[runningEnviroment].image}
                  buttonDisabled={
                    loadingStatus || serverStarting || serverStopping
                  }
                  stopServer={() => stopServer()}
                />
              )}
          </Grid>
        </Grid>
      </Slide>

      {availableEnviroments === null ||
      Object.keys(availableEnviroments).length === 0 ? (
        <Grid item xl={6} md={6} sm={9} sx={{ margin: "auto" }}>
          <Alert severity="info">
            No hay ambientes disponibles. Aún no has comprado ningún curso o no
            has sido añadido a un taller. Si eres parte de un taller, consulta
            con tus profesores/monitores para que se añadan tus cursos.
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
              // if (currentEnviroment !== env.name) {
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
        )
      )}

      {Object.keys(availableCoursesToBuy).length !== 0 &&
      availableCoursesToBuy !== null &&
      availableCoursesToBuy !== undefined ? (
        <>
          {/* <Divider sx={{ margin: "2em", '&::before': {"width": "2%"}}} textAlign="left" variant="middle">
            <Typography variant="subtitle1" color={theme.palette.primary.dark}>
              Tienda:
            </Typography>
          </Divider> */}

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
