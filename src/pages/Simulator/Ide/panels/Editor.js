import { memo } from "react";
import Editor from "@monaco-editor/react";

const PanelEditor = memo(({ handleEditorDidMount, handleEditorChange }) => {
  console.log("re-render");
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
});

export default PanelEditor;
