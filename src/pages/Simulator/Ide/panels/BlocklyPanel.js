import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";

import Blockly from "blockly";
import "./Blockly.css";
import "blockly/python";
import * as Es from "blockly/msg/es";
import DarkTheme from "@blockly/theme-dark";
import { useBlocklyWorkspace } from "react-blockly";
import toolbox from "../../../../michiblock/toolbox";

Blockly.setLocale(Es);

const PREPEND_CODE = `
import rospy
from gatitolabs.iroh import Iroh
robot = Iroh()
`;

const INITIAL_XML =
  '<xml><block type="start" deletable="false" movable="false"></block></xml>';

const PanelBloques = React.memo(({ blocklyCodeRef }) => {
  const blocklyRef = useRef(null);

  const handleOnWorkspaceDidChange = React.useCallback(
    (workspace) => {
      const code = Blockly.Python.workspaceToCode(workspace);
      blocklyCodeRef.current = PREPEND_CODE + code;
    },
    [blocklyCodeRef]
  );

  const { xml } = useBlocklyWorkspace({
    ref: blocklyRef,
    toolboxConfiguration: toolbox, // this must be a JSON toolbox definition
    initialXml:
      localStorage.getItem("blocklyXML") &&
      localStorage.getItem("blocklyXML") !== ""
        ? localStorage.getItem("blocklyXML")
        : INITIAL_XML,
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
    localStorage.setItem("blocklyXML", xml);
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
