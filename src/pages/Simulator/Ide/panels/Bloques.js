import React from "react";
import Grid from "@mui/material/Grid";


import "./Blockly.css"
import "blockly/python";

import Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import toolbox from "../../../../michiblock/toolbox";

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
        toolboxConfiguration={toolbox}
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