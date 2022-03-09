import { useState } from "react";
import Box from "@mui/material/Box";
import Iframe from "react-iframe";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useAuth0 } from "@auth0/auth0-react";

export default function PanelSimulador() {
  const { user } = useAuth0();
  const [simulatorLoading, setSimulatorLoading] = useState(true);
  // const [simulatorSuccess, setSimulatorSuccess] = useState(null);
  const simulatorSuccess = null;

  const simulatorUrl = `${process.env.REACT_APP_SIMULATOR_URL}/${user.email}/proxy/1234/`;
  const failedUrl = simulatorUrl; // url del mensaje personalizado de error

  function onLoad() {
    setSimulatorLoading(false);
  }

  // Chequea si se obtiene respuesta del simulador, sirve para mostrar un mensaje de error personalizado
  /*fetch(simulatorUrl)
  .then(function(response) {
    setSimulatorSuccess(true);
  })
  .catch(function(error) {
    setSimulatorSuccess(false);
  })*/

  return (
    <Box
      id="right-panel"
      width="100%"
      height="100%"
      pointerEvents="auto"
      sx={{ position: "relative" }}
    >
      <Iframe
        onLoad={onLoad}
        id="simuladorFrame"
        title="Simulador Robótico - Gatitolabs"
        width="100%"
        height="100%"
        frameBorder={0}
        src={simulatorSuccess ? simulatorUrl : failedUrl}
      />

      <Backdrop
        id="loading"
        open={simulatorLoading}
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
        <CircularProgress color="secondary" />
      </Backdrop>
    </Box>
  );
}
// </Box>
// react context para obtener el user en el dominio
