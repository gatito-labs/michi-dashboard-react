import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";

import Blockly from "blockly";
import "./Blockly.css";
import "blockly/python";
import DarkTheme from "@blockly/theme-dark";
import { useBlocklyWorkspace } from "react-blockly";

import toolbox from "../../../../michiblock/toolbox";

const PanelBloques = React.memo(() => {
  const blocklyRef = useRef(null);

  const handleOnWorkspaceDidChange = React.useCallback(
    (workspace) => {
      console.log("workspace change");
      const code = Blockly.Python.workspaceToCode(workspace);
      console.log(code);
      // if (editorRef.current) editorRef.current.setValue(code);
    },
    []
  );

  const { xml } = useBlocklyWorkspace({
    ref: blocklyRef,
    toolboxConfiguration: toolbox, // this must be a JSON toolbox definition
    initialXml: localStorage.getItem("xml"),
    onWorkspaceChange: handleOnWorkspaceDidChange,
    workspaceConfiguration: {
      grid: {
        spacing: 50,
        length: 5,
        colour: "#ccc",
        snap: true,
      },
      move: {
        scrollbars: {
          horizontal: false,
          vertical: true,
        },
        wheel: true,
      },
      ...(localStorage.getItem("theme") === "dark" && { theme: DarkTheme }),
    },
  });

  useEffect(() => {
    localStorage.setItem("xml", xml);
  }, [xml]);

  return (
    <Grid
      className="Blockly"
      display="flex"
      flex={1}
      width={"100%"}
      height={"100%"}
    >
      <div id="blocklyDiv" ref={blocklyRef} />
    </Grid>
  );
});

export default PanelBloques;
