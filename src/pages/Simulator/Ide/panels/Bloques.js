import React from "react";
import Box from "@mui/material/Box";

import { BlocklyWorkspace } from "react-blockly";
import Blockly from "blockly";

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
    <Box className="panel" display="flex" flex={1}>
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
    </Box>
  );
});

export default PanelBloques;