import { useState } from "react";
import Box from "@mui/material/Box";
import Iframe from "react-iframe";
import CircularProgress from "@mui/material/CircularProgress";

export default function PanelSimulador() {
  const [simulatorLoading, setSimulatorLoading] = useState(true);
  const [simulatorSuccess, setSimulatorSuccess] = useState(true);

  const simulatorUrl = `${process.env.REACT_APP_SIMULATOR_URL}`;
  const failedUrl = simulatorUrl; // url del mensaje personalizado de error

  function onLoad() {
    setSimulatorLoading(false);
  };

  // Chequea si se obtiene respuesta del simulador, sirve para mostrar un mensaje de error personalizado
  /*fetch(simulatorUrl)
  .then(function(response) {
    setSimulatorSuccess(true);
  })
  .catch(function(error) {
    setSimulatorSuccess(false);
  })*/

  return (
    <Box id="right-panel" pointerEvents="auto">
      <Box width="100%" height="100%" alignItems="center" justifyContent="center" display={simulatorLoading ? "flex" : "none"}>
        <CircularProgress color="secondary" />
      </Box>
      <Iframe
        onLoad={onLoad}
        id="simuladorFrame"
        title="Simulador Robótico - Gatitolabs"
        width="100%"
        height="100%"
        frameBorder={0}
        src={simulatorSuccess ? simulatorUrl : failedUrl}
      ></Iframe>
    </Box>
  );
};

// react context para obtener el user en el dominio