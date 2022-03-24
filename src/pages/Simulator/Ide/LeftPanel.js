import React, { useEffect, useState, useRef, useCallback } from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";

import MuiTab, { tabClasses } from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import CodeButtons from "./panels/components/CodeButtons";

import { Panel } from "./panels/Panel";

import BlocklyPanel from "./panels/BlocklyPanel";
import EditorPanel from "./panels/EditorPanel";
import DocumentationPanel from "./panels/DocumentationPanel";
import Terminal from "./panels/components/Terminal";

import { sendCodeToRobot } from "./services/GazeboSocket";
import { useAuth0 } from "@auth0/auth0-react";
// import { useTheme } from "@mui/material/styles";

// ENUM PANEL
const BLOCKLY = 0;
const EDITOR = 1;
const DOCUMENTATION = 2;

const ARDUINO_TEMPLATE_CODE = `
// En este editor debes escribir código arduino.

#include <KnightRoboticsLibs_Iroh.h>
#include <NewPing.h>
#include <Servo.h>
#include <Wire.h>         
#include <LiquidCrystal_I2C.h>

int IR_Derecho;
int IR_Izquierdo;

void setup(){
    inicializarMovimientoRobot();
    botonInicio();
}

void loop(){

}
`

const getWsUrl = (user_email) => {
  if (
    !process.env.REACT_APP_WS_URL  &&
    process.env.REACT_APP_WS_URL_PREPEND
  ) {
    return (
      process.env.REACT_APP_WS_URL_PREPEND +
      user_email +
      process.env.REACT_APP_WS_URL_APPEND
    );
  } else {
    return process.env.REACT_APP_WS_URL;
  }
};

const Tab = styled(MuiTab)(
  ({ theme }) =>
    `&.${tabClasses.selected} {
    background-color: ${theme.palette.primary.main};
    color: white;
  }`
);

export default function LeftPanel({ setAlertType, handleHide }) {
  // const theme = useTheme();
  const [runLoading, setRunLoading] = useState(false);
  const [panelSelected, setPanelSelected] = useState(
    parseInt(localStorage.getItem("panelSelected")) || 0
  );

  const [terminalOutput, setTerminalOutput] = useState("Terminal ");
  const [terminalLine, setTerminalLine] = useState("");

  useEffect(() => {
    setTerminalOutput((oldOutput) => oldOutput + "\n" + terminalLine);
  }, [terminalLine]); // soluciona el bug de función estática y terminal que no updatea (habrá otra forma directa?)

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

    const savedCode = localStorage.getItem("code");

    editorRef.current.setValue( savedCode ? savedCode : ARDUINO_TEMPLATE_CODE);
  }, []);

  const handleEditorChange = useCallback((value, _) => {
    localStorage.setItem("code", value);
  }, []);

  const handleHideTerminal = useCallback(() => {
    editorRef.current.layout({ width: "auto", height: "auto" });
  }, [editorRef]);

  const user_email = useAuth0().user.email;

  const onLogMessage = useCallback((msg) => {
    setTerminalLine(msg);
  }, []);

  const onSuccessMessage = useCallback(
    (msg) => {
      setTerminalLine(msg);
      console.log("setting alert type");
      setAlertType("success");
    },
    [setAlertType]
  );
  const onErrorMessage = useCallback(
    (msg) => {
      setTerminalLine(msg);
      console.log("setting alert type error");
      setAlertType("error");
    },
    [setAlertType]
  );
  const onFinish = useCallback(() => {
    setRunLoading(false);
  }, []);

  const handleRun = useCallback(() => {
    let url = getWsUrl(user_email);
    console.log(user_email);
    console.log(url);

    setRunLoading(true);
    setTerminalOutput("Subiendo código");

    sendCodeToRobot({
      ws_url: url,
      code: editorRef.current.getValue(),
      onLogMessage: onLogMessage,
      onSuccessMessage: onSuccessMessage,
      onErrorMessage: onErrorMessage,
      onFinish: onFinish,
    });
  }, [user_email, onLogMessage, onSuccessMessage, onErrorMessage, onFinish]);

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
          {panelSelected === BLOCKLY && <BlocklyPanel editorRef={editorRef} />}
        </Panel>

        <Panel selected={panelSelected === EDITOR}>
          <Grid container direction="column">
            <Grid item sx={{ flexGrow: 1, height: "20%" }}>
              <EditorPanel
                handleEditorDidMount={handleEditorDidMount}
                handleEditorChange={handleEditorChange}
              />
            </Grid>

            <Grid
              item
              sx={{ flexGrow: 0, maxHeight: "250px", overflowY: "auto" }}
            >
              <Terminal output={terminalOutput} onHide={handleHideTerminal} />
            </Grid>
          </Grid>
        </Panel>

        <Panel id="documentacion" selected={panelSelected === DOCUMENTATION}>
          <DocumentationPanel />
        </Panel>
      </Grid>

      <Grid item sx={{ width: "100%" }}>
        <Tabs
          value={panelSelected}
          onChange={(_event, newValue) => {
            setPanelSelected(newValue);
          }}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Bloques" />
          <Tab label="Editor" />
          <Tab label="Documentación" />
        </Tabs>
      </Grid>
    </>
  );
}
