import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

import PanelSimulador from "./Simulador";
import AlertsHandler from "./panels/components/AlertsHandler";
import LeftPanel from "./LeftPanel";

// DEFAULT CONFIGS (almacenar en localstorage con algún formato estándar de configuraciones)
const DEFAULT_THEME = "default";
const DEFAULT_LEFT_PANEL_WIDTH = 50;

// CONSTANTS
const dragImg = new Image(0, 0);

// GENERATING THE IDE
export function Ide() {
  // IDE COMPONENTS
  const [alertType, setAlertType] = useState();

  // HANDLE RESIZE (WITH DRAGGING MIDDLE BAR)
  const [leftPanelMaxWidth, setLeftPanelMaxWidth] = useState(
    parseInt(localStorage.getItem("LPWidth")) || 50
  );
  const [isDragging, setIsDragging] = useState(false);

  function activatePanelsPointerEvents() {
    // funciona sin react dada la urgencia de actualizar esta propiedad
    [...document.getElementsByClassName("panel")].forEach(
      (element) => (element.style.pointerEvents = "auto")
    );
    document.getElementById("right-panel").style.pointerEvents = "auto";
  }

  function deactivatePanelsPointerEvents() {
    // funciona sin react dada la urgencia de actualizar esta propiedad
    [...document.getElementsByClassName("panel")].forEach(
      (element) => (element.style.pointerEvents = "none")
    );
    document.getElementById("right-panel").style.pointerEvents = "none";
  }

  function onDragHandler(e) {
    const widthPercentage = Math.floor((e.clientX * 100) / window.innerWidth);
    if (30 <= widthPercentage && widthPercentage <= 50) {
      setLeftPanelMaxWidth(widthPercentage);
      localStorage.setItem("LPWidth", widthPercentage);
      // if (panelSelected === BLOCKLY) {
      // si llama a resize cuando blockly está con display: none ,
      // entonces el workspace desaparecería, necesitando refrescar
      window.dispatchEvent(new Event("resize"));
      // }
    }
  }

  function onDragStartHandler(e) {
    setIsDragging(true);
    deactivatePanelsPointerEvents();
    e.dataTransfer.setDragImage(dragImg, 0, 0);
  }

  function onDragEndHandler(e) {
    setIsDragging(false);
    activatePanelsPointerEvents();
  }

  function onMouseEnterDrag(e) {
    if (!isDragging) {
      deactivatePanelsPointerEvents();
    }
  }

  function onMouseLeaveDrag(e) {
    if (!isDragging) {
      activatePanelsPointerEvents();
    }
  }

  // SETUP
  useEffect(() => {
    if (!localStorage.getItem("LPWidth")) {
      localStorage.setItem("LPWidth", DEFAULT_LEFT_PANEL_WIDTH);
    }
  }, []);

  return (
    <Grid item sx={{ width: "100%", height: "100%" }}>
      <Grid
        container
        direction="row"
        id="IDE"
        sx={{ width: "100%", height: "100%" }}
      >
        <Grid
          container
          direction="column"
          id="left-panel-container"
          sx={{ maxWidth: `${leftPanelMaxWidth}%`, height: "100%" }}
        >
          <LeftPanel setAlertType={setAlertType} />
        </Grid>

        <Grid
          item
          id="draggable"
          draggable
          onDragStart={onDragStartHandler}
          onDrag={onDragHandler}
          onDragEnd={onDragEndHandler}
          onMouseEnter={onMouseEnterDrag}
          onMouseLeave={onMouseLeaveDrag}
          sx={[
            {
              height: "100%",
              width: "10px",
              "&": {
                backgroundColor: "#7f2982",
                cursor: "col-resize",
                maxWidth: "12px",
              },
            },
            {
              "&:hover": {
                backgroundColor: "gray",
              },
            },
          ]}
        />

        <Grid
          item
          id="simulator-panel-container"
          sx={{ flexGrow: 1, height: "100%" }}
        >
          {" "}
          <PanelSimulador />{" "}
        </Grid>
      </Grid>

      <AlertsHandler alertType={alertType} setAlertType={setAlertType} />
    </Grid>
  );
}
