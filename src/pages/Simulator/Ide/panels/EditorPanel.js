import React, { memo, useEffect, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useResizeDetector } from "react-resize-detector";
import Grid from "@mui/material/Grid";
import setUpMustakisEditor from "./utils/EditorUtils";

const PanelEditor = memo(({ handleEditorDidMount, handleEditorChange }) => {
  const editorRef = useRef();

  const _handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      handleEditorDidMount(editor, monaco);

      setUpMustakisEditor(monaco);
    },
    [handleEditorDidMount]
  );

  const onResize = useCallback(
    (width, height) => {
      if (editorRef.current) {
        editorRef.current?.layout({ height, width });
      }
    },
    [editorRef]
  );

  const { ref } = useResizeDetector({
    handleHeight: true,
    handleWidth: true,
    refreshMode: "debounce",
    refreshRate: 100,
    onResize,
  });

  const windowResize = useCallback(() => {
    editorRef.current?.layout({
      width: "auto",
      height: "auto",
    });
  }, [editorRef]);

  useEffect(() => {
    window.addEventListener("resize", windowResize);

    return () => {
      window.removeEventListener("resize", windowResize);
    };
  }, [windowResize]);

  return (
    <Grid
      item
      className="monacoEditor"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
      ref={ref}
    >
      <Editor
        className="panel"
        defaultLanguage="python"
        theme="mustakisTheme"
        onChange={handleEditorChange}
        onMount={_handleEditorDidMount}
        options={{
          minimap: {
            enabled: false,
          },
          semanticHighlighting: {
            enabled: true,
          },
          scrollBeyondLastLine: false,
        }}
      />
    </Grid>
  );
});

export default PanelEditor;
