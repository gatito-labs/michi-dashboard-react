import React, { memo, useEffect, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useResizeDetector } from "react-resize-detector";
import Grid from "@mui/material/Grid";

const PanelEditor = memo(({ handleEditorDidMount, handleEditorChange }) => {
  const editorRef = useRef();

  const _handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      handleEditorDidMount(editor, monaco);
    },
    [handleEditorDidMount]
  );

  const onResize = useCallback(
    (width, height) => {
      if (editorRef.current) {
        console.log(`resize ${width} ${height}`);
        editorRef.current.layout({ height, width });
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
    console.log("window resize");
    editorRef.current.layout({
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
        theme="vs-dark"
        onChange={handleEditorChange}
        onMount={_handleEditorDidMount}
        options={{
          minimap: {
            enabled: false,
          },
          scrollBeyondLastLine: false,
        }}
      />
    </Grid>
  );
});

export default PanelEditor;
