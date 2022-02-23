import React, { useEffect, useState, useRef, useCallback } from "react";
import Grid from "@mui/material/Grid";

import CodeButtons from "./panels/components/CodeButtons";
import { Panel, PanelButton } from "./panels/LeftPanel";

import PanelBloques from "./panels/Bloques";
import PanelEditor from "./panels/Editor";
import PanelDocumentacion from "./panels/Documentacion";
import PanelSimulador from "./panels/Simulador";
import Terminal from "./panels/components/Terminal";
import AlertsHandler from "./panels/components/AlertsHandler";

// DEFAULT CONFIGS (almacenar en localstorage con algún formato estándar de configuraciones)
const DEFAULT_THEME = "default";
const DEFAULT_LEFT_PANEL_WIDTH = 50;

// CONSTANTS
const dragImg = new Image(0, 0);

// ENUM PANEL
const BLOCKLY = 0;
const EDITOR = 1;
const DOCUMENTATION = 2;

// GENERATING THE IDE
export function Ide() {
  // IDE COMPONENTS
  const [alertType, setAlertType] = useState();
  const [panelSelected, setPanelSelected] = useState(
    parseInt(localStorage.getItem("panelSelected")) || 0
  );

  useEffect(() => {
    localStorage.setItem("panelSelected", panelSelected);
    if (panelSelected === BLOCKLY) {
      // si llama a resize cuando blockly está con display: none ,
      // entonces el workspace desaparecería, necesitando refrescar
      window.dispatchEvent(new Event("resize"));
    }
  }, [panelSelected]);

  // HANDLING BLOCKLY
  // const blocklyRef = useRef();

  // HANDLING EDITOR
  const editorRef = useRef();
  const monacoRef = useRef();

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editorRef.current.setValue(localStorage.getItem("code"));
  }

  function handleEditorChange(value, _) {
    localStorage.setItem("code", value);
  }

  // HANDLING CODE BUTTONS
  const [runLoading, setRunLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("Output de ejemplo,\nesta terminal necesita usar el símbolo \\n para\nsimular el salto de línea.\n\nEsta terminal no se mostrará si no existe un mensaje impreso.");

  function setOutput(output) {
    setTerminalOutput("" + output);
  }

  function handleRun() {
    setRunLoading(true);
    setOutput("Subiendo código");

    let formData = new FormData();
    formData.append("arduino_code", editorRef.current.getValue());

    fetch(`${process.env.REACT_APP_FLASK_URL}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setRunLoading(false);
        return response.json();
      })
      .then((data) => {
        setRunLoading(false);
        console.log("STDOUT:\n", data.stdout); // outputs del compilador/intérprete del servidor
        console.log("STDERR:\n", data.stderr); // errores del compilador/intérprete del servidor

        if (data.stderr !== "No Error") {
          setAlertType("error");
          setOutput(data.stderr);
        } else {
          setAlertType("success");
          setOutput(data.stdout);
        }
      })
      .catch((error) => {
        setRunLoading(false);
        setAlertType("error");
        console.log("Error en fetch:\n", error);
        setOutput("Error", error);
      });
  }

  function handleStop() {
    console.log("parar función");
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([localStorage.getItem("code")], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = "archivo.py";
    element.click();
  }

  function handleUpload(event) {
    const file = event.target.files[0];

    function handleFileRead(e) {
      const content = fileReader.result;
      editorRef.current.setValue(content);
      setPanelSelected(1);
    }

    const fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  }

  // HANDLE RESIZE (WITH DRAGGING MIDDLE BAR)
  const [leftPanelMaxWidth, setLeftPanelMaxWidth] = useState(parseInt(localStorage.getItem("LPWidth")) || 50);
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
      if (panelSelected === BLOCKLY) {
        // si llama a resize cuando blockly está con display: none ,
        // entonces el workspace desaparecería, necesitando refrescar
        window.dispatchEvent(new Event("resize"));
      }
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
          id="left-panel"
          sx={{ maxWidth: `${leftPanelMaxWidth}%`, height: "100%" }}
        >
          <Grid item>
            <CodeButtons
              runLoading={runLoading}
              handleRun={handleRun}
              handleStop={handleStop}
              handleDownload={handleDownload}
              handleUpload={handleUpload}
              sx={{ display: "flex", minHeight: "50px", height: "5%" }}
            />
          </Grid>
          <Grid item sx={{ flexGrow: 2 }}>
            <Panel selected={panelSelected === BLOCKLY}>
              <PanelBloques editorRef={editorRef} />
            </Panel>

            <Panel selected={panelSelected === EDITOR}>
              <PanelEditor
                handleEditorDidMount={useCallback(
                  (editor, monaco) => handleEditorDidMount(editor, monaco),
                  []
                )}
                handleEditorChange={useCallback(
                  (value, _) => handleEditorChange(value, _),
                  []
                )}
              />
            </Panel>

            <Panel id="documentacion" selected={panelSelected === DOCUMENTATION}>
              <PanelDocumentacion />
            </Panel>
          </Grid>
          <Grid minHeight="50%" display={terminalOutput ? "block" : "none"}>
            <Terminal output={terminalOutput} />
          </Grid>
          <Grid item>
            <Grid
              container
              id="panels-buttons"
              display="flex"
              marginBottom={0}
              height="5%"
              minHeight="50px"
              width="100%"
              borderTop={2}
              borderColor="#7F2982"
            >
              <PanelButton
                name="Bloques"
                selected={panelSelected === BLOCKLY}
                onClickHandler={() => setPanelSelected(BLOCKLY)}
              />
              <PanelButton
                name="Editor"
                selected={panelSelected === EDITOR}
                onClickHandler={() => setPanelSelected(EDITOR)}
              />
              <PanelButton
                name="Documentación"
                selected={panelSelected === DOCUMENTATION}
                onClickHandler={() => setPanelSelected(DOCUMENTATION)}
              />
            </Grid>
          </Grid>
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
                backgroundColor: "secondary.main",
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

        <Grid item id="simulador" sx={{ flexGrow: 1, height: "100%" }}>
          {" "}
          <PanelSimulador />{" "}
        </Grid>
      </Grid>
      
      <AlertsHandler alertType={alertType} setAlertType={setAlertType} />
    </Grid>
  );
}
