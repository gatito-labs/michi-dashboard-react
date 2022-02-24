import React, { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";

import PanelSimulador from "./Simulador";
import AlertsHandler from "./panels/components/AlertsHandler";
import LeftPanel from "./LeftPanel";

// DEFAULT CONFIGS (almacenar en localstorage con algún formato estándar de configuraciones)
const DEFAULT_THEME = "default";
const DEFAULT_LEFT_PANEL_WIDTH = 50;

// GENERATING THE IDE
export function Ide() {
  const [alertType, setAlertType] = useState();

  // variable to handle panel resize
  const [leftPanelMaxWidth, setLeftPanelMaxWidth] = useState(
    parseInt(localStorage.getItem("LPWidth")) || 50
  );

  const [isDragging, setIsDragging] = useState(false);

  const onMove = useCallback((clientX) => {
    const widthPercentage = Math.floor((clientX * 100) / window.innerWidth);

    if (20 <= widthPercentage && widthPercentage <= 70) {
      setLeftPanelMaxWidth(widthPercentage);
      localStorage.setItem("LPWidth", widthPercentage);
      window.dispatchEvent(new Event("resize"));
    }
  }, []);

  const activatePanelsPointerEvents = useCallback(() => {
    document.getElementById("left-panel-container").style.pointerEvents =
      "auto";
    document.getElementById("simulator-panel-container").style.pointerEvents =
      "auto";
  }, []);

  const deactivatePanelsPointerEvents = useCallback(() => {
    document.getElementById("left-panel-container").style.pointerEvents =
      "none";
    document.getElementById("simulator-panel-container").style.pointerEvents =
      "none";
  }, []);

  const onMouseDown = useCallback(() => {
    setIsDragging(true);
    deactivatePanelsPointerEvents();
  }, [deactivatePanelsPointerEvents]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    activatePanelsPointerEvents();
  }, [activatePanelsPointerEvents]);

  const onMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        onMove(e.clientX);
      }
    },
    [isDragging, onMove]
  );

  const onTouchStart = useCallback(
    (e) => {
      onMove(e.touches[0].clientX);
      setIsDragging(true);
    },
    [onMove]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        onMove(e.touches[0].clientX);
      }
    },
    [isDragging, onMove]
  );

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
    };
  });

  // SETUP
  useEffect(() => {
    if (!localStorage.getItem("LPWidth")) {
      localStorage.setItem("LPWidth", DEFAULT_LEFT_PANEL_WIDTH);
    }
  }, []);

  return (
    <Grid item sx={{ position: "relative", width: "100%", height: "100%" }}>
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
          sx={{
            maxWidth: `${leftPanelMaxWidth}%`,
            height: "100%",
            overflowX: "hidden",
          }}
        >
          <LeftPanel setAlertType={setAlertType} />
        </Grid>

        <Grid
          item
          id="divider"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onMouseUp}
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
          <PanelSimulador />{" "}
        </Grid>
      </Grid>

      <AlertsHandler alertType={alertType} setAlertType={setAlertType} />
    </Grid>
  );
}
