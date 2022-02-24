import React, { useEffect, useState, useRef, useCallback } from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";

import MuiTab, { tabClasses } from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import CodeButtons from "./panels/components/CodeButtons";

import { Panel } from "./panels/Panel";

import PanelBloques from "./panels/Bloques";
import PanelEditor from "./panels/Editor";
import PanelDocumentacion from "./panels/Documentacion";

import Terminal from "./panels/components/Terminal";

// ENUM PANEL
const BLOCKLY = 0;
const EDITOR = 1;
const DOCUMENTATION = 2;

const Tab = styled(MuiTab)`
  &.${tabClasses.selected} {
    background-color: #7f2982;
    color: white;
  }
`;

export default function LeftPanel({ setAlertType, handleHide }) {
  const [runLoading, setRunLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState(
    "Output de ejemplo,\nesta terminal necesita usar el símbolo \\n para\nsimular el salto de línea.\n\nEsta terminal no se mostrará si no existe un mensaje impreso."
  );
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

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editorRef.current.setValue(localStorage.getItem("code"));
  }, []);

  const handleEditorChange = useCallback((value, _) => {
    localStorage.setItem("code", value);
  }, []);

  // HANDLING CODE BUTTONS
  const setOutput = useCallback((output) => {
    setTerminalOutput("" + output);
  }, []);

  const handleRun = useCallback(() => {
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
  }, [setAlertType, setOutput]);

  const handleStop = useCallback(() => {
    console.log("parar función");
  }, []);

  const handleDownload = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([localStorage.getItem("code")], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = "archivo.py";
    element.click();
  }, []);

  const handleUpload = useCallback((event) => {
    const file = event.target.files[0];

    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const content = fileReader.result;
      editorRef.current.setValue(content);
      setPanelSelected(1);
    };

    fileReader.readAsText(file);
  }, []);

  return (
    <>
      <CodeButtons
        runLoading={runLoading}
        handleRun={handleRun}
        handleStop={handleStop}
        handleDownload={handleDownload}
        handleUpload={handleUpload}
        handleHide={handleHide}
      />

      <Grid item sx={{ flexGrow: 2, width: "100%", overflowX: "hidden" }}>
        <Panel selected={panelSelected === BLOCKLY}>
          {/* this is because blockly-ws breaks when leftPanel is resized while blockly is not active */}
          {panelSelected === BLOCKLY && <PanelBloques editorRef={editorRef} />}
        </Panel>

        <Panel selected={panelSelected === EDITOR}>
          <Grid container direction="column">
            <Grid item sx={{ flexGrow: 2, width: "100%" }}>
              <PanelEditor
                handleEditorDidMount={handleEditorDidMount}
                handleEditorChange={handleEditorChange}
              />
            </Grid>

            <Grid
              item
              height="50%"
              width="100%"
              display={terminalOutput ? "block" : "none"}
            >
              <Terminal output={terminalOutput} />
            </Grid>
          </Grid>
        </Panel>

        <Panel id="documentacion" selected={panelSelected === DOCUMENTATION}>
          <PanelDocumentacion />
        </Panel>
      </Grid>

      <Grid item sx={{ width: "100%" }}>
        <Tabs
          value={panelSelected}
          onChange={(event, newValue) => {
            setPanelSelected(newValue);
          }}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Bloques" key="Bloques" />
          <Tab label="Editor" key="Editor" />
          <Tab label="Documentación" key="Documentación" />
        </Tabs>
      </Grid>
    </>
  );
}
