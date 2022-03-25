import { useCallback, useState } from "react";
import Grid from "@mui/material/Grid";
import IconButton, { iconButtonClasses } from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { CodeButtonTooltip } from "../../../../../components/Tooltip";
import { styled } from "@mui/material/styles";

const FONT_SIZE = "1em";

const RunButton = ({ runLoading, handleRun }) => (
  <CodeButtonTooltip
    title={runLoading ? "Subiendo Programa" : "Lanzar programa"}
  >
    {runLoading ? (
      <div style={{ display: "inline-block" }}>
        <IconButton onClick={handleRun} disabled={runLoading}>
          <CircularProgress color="success" size={FONT_SIZE} />
        </IconButton>
      </div>
    ) : (
      <IconButton onClick={handleRun}>
        <PlayCircleIcon style={{ fill: "green", fontSize: FONT_SIZE }} />
      </IconButton>
    )}
  </CodeButtonTooltip>
);
const StopButton = ({ handleStop }) => (
  <CodeButtonTooltip title="Detener programa">
    <IconButton onClick={handleStop}>
      <StopCircleIcon style={{ fill: "red", fontSize: FONT_SIZE }} />
    </IconButton>
  </CodeButtonTooltip>
);

const DownloadButton = ({ handleDownload }) => (
  <CodeButtonTooltip title="Descargar archivo">
    <IconButton onClick={handleDownload}>
      <FileDownloadIcon style={{ fill: "blue", fontSize: FONT_SIZE }} />
    </IconButton>
  </CodeButtonTooltip>
);

const Input = styled("input")({
  display: "none",
});

const UploadButton = ({ handleUpload }) => (
  <CodeButtonTooltip title="Subir archivo">
    <label htmlFor="upload-icon-button-file">
      <Input type="file" id="upload-icon-button-file" onChange={handleUpload} />
      <IconButton aria-label="upload picture" component="span">
        <FileUploadIcon style={{ fill: "blue", fontSize: FONT_SIZE }} />
      </IconButton>
    </label>
  </CodeButtonTooltip>
);

const HidePanelButton = ({ handleHide }) => (
  <CodeButtonTooltip title="Ocultar Panel Editor">
    <IconButton onClick={handleHide}>
      <ChevronLeftIcon color="primary" sx={{ fontSize: FONT_SIZE }} />
    </IconButton>
  </CodeButtonTooltip>
);

export default function CodeButtons({
  runLoading,
  handleRun,
  handleStop,
  handleDownload,
  handleUpload,
  handleHide,
}) {
  return (
    <>
      <Grid
        id="code-buttons"
        container
        direction="row"
        sx={{
          flexDirection: "row",
          minHeight: "40px",
          height: "4vh",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Grid item>
          <RunButton id="runButton" runLoading={runLoading} handleRun={handleRun} />
          <StopButton id="stopButton" handleStop={handleStop} />
          <DownloadButton id="downloadButton" handleDownload={handleDownload} />
          <UploadButton id="uploadButton" handleUpload={handleUpload} />
        </Grid>
        <Grid item sx={{ flexGrow: 1, height: "100%" }} />
        <Grid>
          <HidePanelButton handleHide={handleHide} />
        </Grid>
      </Grid>
    </>
  );
}
