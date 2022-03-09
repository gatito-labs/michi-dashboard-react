import React, { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import LeftPanel from "./LeftPanel";
import SimulatorPanel from "./SimulatorPanel";
import AlertsHandler from "./panels/components/AlertsHandler";

import { useTheme } from "@mui/material/styles";


// DEFAULT CONFIGS (almacenar en localstorage con algún formato estándar de configuraciones)
// const DEFAULT_THEME = "default";
const DEFAULT_LEFT_PANEL_WIDTH = 50;

// GENERATING THE IDE
export function Ide() {

  const theme = useTheme();
  const [alertType, setAlertType] = useState();

  // variable to handle panel resize
  const [leftPanelMaxWidth, setLeftPanelMaxWidth] = useState(
    parseInt(localStorage.getItem("LPWidth")) || 50
  );

  const [hideLeftPanel, setHideLeftPanel] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const onMove = useCallback((clientX) => {
    const widthPercentage =
      Math.round((10 * (clientX * 100)) / window.innerWidth) / 10;

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
  }, [onMouseMove, onMouseUp, onTouchMove]);

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
            display: hideLeftPanel ? "none" : "flex",
            flexWrap: "nowrap"
          }}
        >
          <LeftPanel
            setAlertType={setAlertType}
            handleHide={() => setHideLeftPanel(true)}
          />
        </Grid>

        <Grid
          container
          id="divider"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onMouseUp}
          sx={[
            {
              justifyContent: "center",
              alignItems: "center",
              margin: 0,
              padding: 0,
              height: "100%",
              width: "10px",
              "&": {
                backgroundColor: theme.palette.primary.main,
                cursor: "col-resize",
                maxWidth: "12px",
              },
            },

            {
              "&:hover": {
                backgroundColor: "gray",
              },

              "&:active": {
                backgroundColor: "gray",
              },
            },
          ]}
        >
          {hideLeftPanel ? (
            <IconButton
              onClick={() => setHideLeftPanel(false)}
              sx={{ height: "100%" }}
            >
              <ChevronRightIcon
                sx={{ color: "white", position: "relative", top: "-50px" }}
              />
            </IconButton>
          ) : (
            <MoreVertIcon
              id="three-dots"
              sx={{ color: "white", position: "relative", top: "-50px" }} // -50px is to position the dots higher
            />
          )}
        </Grid>

        <Grid
          item
          id="simulator-panel-container"
          sx={{ flexGrow: 1, height: "100%" }}
        >
          <SimulatorPanel />
        </Grid>
      </Grid>

      <AlertsHandler alertType={alertType} setAlertType={setAlertType} />
    </Grid>
  );
}
