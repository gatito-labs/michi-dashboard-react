import React, { useState, useCallback, useEffect } from "react";
import { TerminalContextProvider } from "react-terminal";
import Ide from "./Ide";
import Joyride, { STATUS } from "react-joyride";
import { useTheme } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  backgroundColor: "white",
  border: "2px solid #999",
  boxShadow: 50,
  p: 4,
  alignItems: "center",
  padding: "2em",
  gap: "1em"
};

const StartTutorialModal = ({ open, handleClose, setRun, skipTutorial }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-descarga-codigo"
      aria-describedby="Este modal es para descargar tu código, ingresa el nombre del archivo."
    >
      <Grid container direction="column" style={modalStyle}>
        <Grid>
          <img
            height="50px"
            src={`${process.env.PUBLIC_URL}/logo.png`}
            alt={"GatitoLabs logo"}
          />
        </Grid>
        <Grid item>
          Notamos que es tu primera vez en el simulador. ¿Quieres realizar un
          tour por el simulador?
        </Grid>

        <Grid item>
          <Grid container direction="row" sx={{ gap: "1em" }}>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  setRun(true);
                  handleClose();
                }}
              >
                Realizar!
              </Button>
            </Grid>

            <Grid>
              <Button
                variant="outlined"
                onClick={() => {
                  skipTutorial();
                  handleClose();
                }}
              >
                {" "}
                No Gracias{" "}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};

const Simulator = () => {
  const theme = useTheme();
  const [run, setRun] = useState(false);
  const [openTutorialModal, setOpenTutorialModal] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("skipTutorial") === undefined ||
      localStorage.getItem("skipTutorial") === null ||
      !localStorage.getItem("skipTutorial")
    ) {
      setOpenTutorialModal(true);
    }
  }, []);

  const skipTutorial = useCallback(() => {
    localStorage.setItem("skipTutorial", true);
  }, []);

  const [steps, _] = useState([
    {
      target: "#simulator-panel-container",
      title: "El simulador y tu Robot",
      disableBeacon: true,
      content: (
        <React.Fragment>
          En este panel encontramos el simulador, aquí encuentras tu robot Iroh
          y todos sus componentes. A la izquierda encuentras un panel con sus
          sensores y su pantalla LCD, y a la derecha puedes verlo e interactuar
          con él directamente.
        </React.Fragment>
      ),
    },

    {
      target: ".monacoEditor",
      title: "El Editor de Código",
      content: (
        <React.Fragment>
          En el editor de código puedes programar directamente tu robot. Debes
          programarlo utilizando el lenguaje Arduino, y cuentas con las mismas
          funciones que en tu robot físico.
        </React.Fragment>
      ),
    },
    {
      target: "#run-button",
      title: "Correr Código",
      content: (
        <React.Fragment>
          Una vez esté listo de tu programa, dale al botón de play para probar
          tu código, este lo compilará y subirá a tu robot.
        </React.Fragment>
      ),
    },

    {
      target: "#terminal-container",
      title: "La Terminal",
      content: (
        <React.Fragment>
          En esta terminal verás el resultado del proceso de compilación, te
          avisará si tu programa está listo para ejecutarse, o te indicará los
          posibles errores de compilación.
          <br />
          Si quieres más espacio para programar puedes ocultar esta terminal
          haciendo click en su barra superior.
        </React.Fragment>
      ),
    },

    {
      target: "#download-button",
      title: "Descarga tu código",
      content: (
        <React.Fragment>
          Con este botón puedes descargar tu código. Descarga tu código para
          guardar diferentes programas en tu computadora, estos programas puedes
          probarlo luego en tu robot físico.
        </React.Fragment>
      ),
    },
    {
      target: "#upload-button",
      title: "Sube tu código",
      content: (
        <React.Fragment>
          También puedes suber un programa que hayas escrito y guardado
          previamente.
        </React.Fragment>
      ),
    },
    {
      target: "#divider, #hide-button",
      title: "Trabaja cómodamente",
      content: (
        <React.Fragment>
          Finalmente, puedes ocultar el editor completamente o puedes arrastra
          el divisor para fijar el tamaño a tu gusto. .
        </React.Fragment>
      ),
    },
  ]);

  const handleJoyrideCallback = useCallback(
    (data) => {
      const { status, type } = data;
      const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

      if (finishedStatuses.includes(status)) {
        setRun(false);
        skipTutorial();
      }

      console.groupCollapsed(type);
      console.log(data);
      console.groupEnd();
    },
    [skipTutorial]
  );

  return (
    <TerminalContextProvider>
      <Joyride
        steps={steps}
        run={run}
        locale={{
          back: "Atrás",
          close: "Cerrar",
          last: "Último",
          next: "Siguiente",
          open: "Abrir diálogo",
          skip: "Saltar",
        }}
        callback={handleJoyrideCallback}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        styles={{
          options: {
            primaryColor: theme.palette.primary.main,
            zIndex: 2000000,
          },
        }}
      />
      <Ide />
      <StartTutorialModal
        setRun={setRun}
        open={openTutorialModal}
        handleClose={() => setOpenTutorialModal(false)}
        skipTutorial={skipTutorial}
      />
    </TerminalContextProvider>
  );
};

export default Simulator;
