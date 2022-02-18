import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import { BlocklyWorkspace } from "react-blockly";
import Blockly from "blockly";
import "./Blockly.css"
import Toolbox from "./blockly/toolbox/toolbox";

const PanelBloques = React.memo(({editorRef}) => {
  const handleOnXmlChange = React.useCallback((xml) => {
    localStorage.setItem("xml", xml)
  }, []);

  const handleOnWorkspaceDidChange = React.useCallback((workspace) => {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    if (editorRef.current) editorRef.current.setValue(code);
  }, [editorRef]);

  return (
    <Grid className="Blockly"  display="flex" flex={1} width={"100%"} height={"100%"}>
      <BlocklyWorkspace
        toolboxConfiguration={Toolbox}
        workspaceConfiguration={{
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
        }}
        initialXml={localStorage.getItem("xml")}
        onXmlChange={handleOnXmlChange}
        onWorkspaceChange={handleOnWorkspaceDidChange}
      />
    </Grid>
  );
});

export default PanelBloques;