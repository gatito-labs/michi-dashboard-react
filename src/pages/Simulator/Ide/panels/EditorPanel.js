import React, { memo, useEffect, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useResizeDetector } from "react-resize-detector";
import Grid from "@mui/material/Grid";

import { createDependencyProposals } from "./utils/EditorUtils";

const PanelEditor = memo(({ handleEditorDidMount, handleEditorChange }) => {
  const editorRef = useRef();

  const _handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      handleEditorDidMount(editor, monaco);
  
      monaco.languages.registerCompletionItemProvider('cpp', {
        provideCompletionItems: function (model, position) {
          // find out if we are completing a property in the 'dependencies' object.
          var textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
          var match = textUntilPosition.match(
            ".*"
          );
          if (!match) {
            return { suggestions: [] };
          }
          var word = model.getWordUntilPosition(position);
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          return {
            suggestions: createDependencyProposals(range, monaco)
          };
        }
      });

    },
    [handleEditorDidMount]
  );

  const onResize = useCallback(
    (width, height) => {
      if (editorRef.current) {
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
        defaultLanguage="cpp"
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
