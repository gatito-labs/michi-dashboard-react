import React, { useEffect, useState, useRef, useCallback } from "react";
import { styled } from "@mui/system";
import MuiTab, { tabClasses } from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Grid from "@mui/material/Grid";
import DownloadModal from "./components/DownloadModal";
import CodeButtons from "./panels/components/CodeButtons";
import Panel from "./panels/Panel";
import BlocklyPanel from "./panels/BlocklyPanel";
import EditorPanel from "./panels/EditorPanel";
import DocumentationPanel from "./panels/DocumentationPanel";
import Terminal from "./panels/components/Terminal";
import { sendCodeToRobot } from "./services/GazeboSocket";
import { useAuth0 } from "@auth0/auth0-react";
import { useHubServer } from "../../../store";

// ENUM PANEL
const BLOCKLY = "blockly";
const EDITOR = "editor";
const DOCUMENTATION = "docs";

const ARDUINO_TEMPLATE_CODE = `
// En este editor debes escribir tu código

`;

const getWsUrl = (user_email) => {
  if (!process.env.REACT_APP_WS_URL && process.env.REACT_APP_WS_URL_PREPEND) {
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
  const {
    serverRunning,
    runningEnviroment,
    availableEnviroments,
    getAvailableEnviroments,
  } = useHubServer();

  const user_email = useAuth0().user.email;
  const { getAccessTokenSilently } = useAuth0();
  const [enviromentConfig, setEnviromentConfig] = useState({
    language: "",
    editor: "",
  });
  const [runLoading, setRunLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState("Terminal ");
  const [terminalLine, setTerminalLine] = useState("");
  const [panelSelected, setPanelSelected] = useState(
    parseInt(localStorage.getItem("panelSelected")) || EDITOR
  );
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  useEffect(() => {
    if (serverRunning) {
      if (availableEnviroments === null) {
        getAvailableEnviroments();
      } else {
        if (availableEnviroments[runningEnviroment]) {
          setEnviromentConfig(availableEnviroments[runningEnviroment]);
        } else {
          console.error(
            "Error inesperado, ambiente no se encuentra en los ambientes disponibles"
          );
        }
      }
    }
  }, [
    serverRunning,
    runningEnviroment,
    availableEnviroments,
    getAvailableEnviroments,
  ]);

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
  const blocklyCodeRef = useRef("");

  // HANDLING EDITOR
  const editorRef = useRef();
  const monacoRef = useRef();

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    if (runningEnviroment) {
      const savedCode =
        localStorage.getItem(`code_${runningEnviroment}`) || null;

      editorRef.current.setValue(
        savedCode !== null && savedCode !== undefined
          ? savedCode
          : ARDUINO_TEMPLATE_CODE
      );
    }
  }, [runningEnviroment]);

  useEffect(() => {
    console.log("aqui");
    if (editorRef && editorRef.current) {
      const savedCode =
        localStorage.getItem(`code_${runningEnviroment}`) || null;

      editorRef.current.setValue(
        savedCode !== null && savedCode !== undefined
          ? savedCode
          : ARDUINO_TEMPLATE_CODE
      );
    }
  }, [runningEnviroment, editorRef]);

  const handleEditorChange = useCallback(
    (value, _) => {
      localStorage.setItem(`code_${runningEnviroment}`, value);
    },
    [runningEnviroment]
  );

  const handleHideTerminal = useCallback(() => {
    editorRef.current.layout({ width: "auto", height: "auto" });
  }, [editorRef]);

  const onLogMessage = useCallback((msg) => {
    setTerminalLine(msg);
  }, []);

  const onSuccessMessage = useCallback(
    (msg) => {
      setTerminalLine(msg);
      setAlertType("success");
    },
    [setAlertType]
  );

  const onErrorMessage = useCallback(
    (msg) => {
      setTerminalLine(msg);
      setAlertType("error");
    },
    [setAlertType]
  );

  const onFinish = useCallback(() => {
    setRunLoading(false);
  }, []);

  const handleRun = useCallback(() => {
    let url = getWsUrl(user_email);
    setRunLoading(true);
    setTerminalOutput("Subiendo código");

    sendCodeToRobot({
      ws_url: url,
      user: user_email,
      code:
        panelSelected === BLOCKLY
          ? blocklyCodeRef.current
          : editorRef.current.getValue(),
      language: enviromentConfig.language,
      onLogMessage: onLogMessage,
      onSuccessMessage: onSuccessMessage,
      onErrorMessage: onErrorMessage,
      onFinish: onFinish,
      getAccessTokenSilently: getAccessTokenSilently,
    });
  }, [
    panelSelected,
    user_email,
    enviromentConfig,
    onLogMessage,
    onSuccessMessage,
    onErrorMessage,
    onFinish,
    getAccessTokenSilently,
  ]);

  const handleStop = useCallback(() => {
    console.log("parar función");
  }, []);

  const handleDownload = useCallback(
    (filename) => {
      const element = document.createElement("a");
      const file = new Blob(
        [localStorage.getItem(`code_${runningEnviroment}`)],
        {
          type: "text/plain;charset=utf-8",
        }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${filename}.${
        enviromentConfig.language === "python" ? "py" : "ino"
      }`;
      element.click();
    },
    [enviromentConfig, runningEnviroment]
  );

  const handleUpload = useCallback((event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const content = fileReader.result;
      editorRef.current.setValue(content);
      setPanelSelected(EDITOR);
    };

    fileReader.readAsText(file);
  }, []);

  return (
    <>
      <CodeButtons
        runLoading={runLoading}
        stopDisabled={true}
        handleRun={handleRun}
        handleStop={handleStop}
        handleDownload={() => setOpenDownloadModal(true)}
        handleUpload={handleUpload}
        handleHide={handleHide}
      />

      <Grid item sx={{ flexGrow: 2, width: "100%", overflowX: "hidden" }}>
        {enviromentConfig && enviromentConfig.blockly && (
          <Panel selected={panelSelected === BLOCKLY}>
            {/* this is because blockly-ws breaks when leftPanel is resized while blockly is not active */}
            {panelSelected === BLOCKLY && (
              <BlocklyPanel blocklyCodeRef={blocklyCodeRef} />
            )}
          </Panel>
        )}

        <Panel selected={panelSelected === EDITOR}>
          <Grid container direction="column">
            <Grid item sx={{ flexGrow: 1, height: "20%" }}>
              <EditorPanel
                language={enviromentConfig?.editor}
                handleEditorDidMount={handleEditorDidMount}
                handleEditorChange={handleEditorChange}
              />
            </Grid>

            <Grid
              item
              id="terminal-container"
              sx={{ flexGrow: 0, maxHeight: "250px", overflowY: "auto" }}
            >
              <Terminal output={terminalOutput} onHide={handleHideTerminal} />
            </Grid>
          </Grid>
        </Panel>

        <Panel id="documentacion" selected={panelSelected === DOCUMENTATION}>
          <DocumentationPanel url_doc={enviromentConfig?.doc_url}/>
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
          {enviromentConfig && enviromentConfig["blockly?"] && (
            <Tab value={BLOCKLY} label="Bloques" />
          )}
          <Tab value={EDITOR} label="Editor" />
          <Tab value={DOCUMENTATION} label="Documentación" />
        </Tabs>
      </Grid>

      <DownloadModal
        open={openDownloadModal}
        handleClose={() => setOpenDownloadModal(false)}
        handleDownload={handleDownload}
        extension={enviromentConfig?.language === "python" ? "py" : "ino"}
      />
    </>
  );
}
