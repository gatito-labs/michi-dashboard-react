import { useState } from "react";
import Box from "@mui/material/Box";
import Iframe from "react-iframe";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { useHubServer } from "../../../store";
import { Link } from "react-router-dom";

export default function PanelSimulador() {
  const { user } = useAuth0();
  const { serverRunning, loadingStatus, startingServer } = useHubServer();
  const [simulatorLoading, setSimulatorLoading] = useState(true);
  const simulatorUrl = `${process.env.REACT_APP_SIMULATOR_URL}${user.email}`;

  function onLoad() {
    setSimulatorLoading(false);
  }

  return (
    <Box
      id="right-panel"
      width="100%"
      height="100%"
      pointerEvents="auto"
      sx={{ position: "relative" }}
    >
      {serverRunning && (
        <Iframe
          onLoad={onLoad}
          id="simuladorFrame"
          title="Simulador Robótico - Gatitolabs"
          width="100%"
          height="100%"
          frameBorder={0}
          src={simulatorUrl}
        />
      )}

      <Backdrop
        id="loading"
        open={
          simulatorLoading || !serverRunning || loadingStatus || startingServer
        }
        width="100%"
        height="100%"
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {!serverRunning && !loadingStatus && !startingServer ? (
          <Alert variant="filled" severity="info">
            <Grid
              container
              direction="column"
              sx={{ alignItems: "center", gap: "1em" }}
            >
              <Grid item>
                Debes seleccionar un ambiente de simulación para empezar
              </Grid>

              <Grid item>
                <Link to="/ambientes">
                  <Button variant="contained"> Ir a Ambientes </Button>
                </Link>
              </Grid>
            </Grid>
          </Alert>
        ) : (
          <CircularProgress color="secondary" />
        )}
      </Backdrop>
    </Box>
  );
}
