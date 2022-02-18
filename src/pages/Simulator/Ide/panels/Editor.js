import React from "react";
import Editor from "@monaco-editor/react";

const PanelEditor = React.memo(
  ({ handleEditorDidMount, handleEditorChange }) => {
    console.log("uwuuuuuuuuuuuu editor");
    return (
      <Editor
        className="panel"
        defaultLanguage="python"
        theme="vs-dark"
        height="100%"
        minWidth="100px"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    );
  }
);

export default PanelEditor;
