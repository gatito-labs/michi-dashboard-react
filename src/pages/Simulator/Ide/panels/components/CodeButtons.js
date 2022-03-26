import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { CodeButtonTooltip } from "../../../../../components/Tooltip";
import { styled } from "@mui/material/styles";

const FONT_SIZE = "1em";

const RunButton = ({ id, runLoading, handleRun }) => (
  <CodeButtonTooltip
    title={runLoading ? "Subiendo Programa" : "Lanzar programa"}
  >
    <Grid id={id}>
      <IconButton onClick={handleRun} disabled={runLoading}>
        {runLoading ? (
          <CircularProgress color="success" size={FONT_SIZE} />
        ) : (
          <PlayCircleIcon style={{ fill: "green", fontSize: FONT_SIZE }} />
        )}
      </IconButton>
    </Grid>
  </CodeButtonTooltip>
);
const StopButton = ({ id, handleStop, disabled }) => (
  <CodeButtonTooltip title="Detener programa">
    <Grid id={id}>
      <IconButton onClick={handleStop} disabled={disabled}>
        <StopCircleIcon
          style={{ fill: disabled ? "gray" : "red", fontSize: FONT_SIZE }}
        />
      </IconButton>
    </Grid>
  </CodeButtonTooltip>
);

const DownloadButton = ({ id, handleDownload }) => (
  <CodeButtonTooltip title="Descargar archivo">
    <IconButton onClick={handleDownload} id={id}>
      <FileDownloadIcon style={{ fill: "blue", fontSize: FONT_SIZE }} />
    </IconButton>
  </CodeButtonTooltip>
);

const Input = styled("input")({
  display: "none",
});

const UploadButton = ({ id, handleUpload }) => (
  <CodeButtonTooltip title="Subir archivo">
    <label htmlFor="upload-icon-button-file">
      <Input type="file" id="upload-icon-button-file" onChange={handleUpload} />
      <IconButton aria-label="upload picture" component="span" id={id}>
        <FileUploadIcon style={{ fill: "blue", fontSize: FONT_SIZE }} />
      </IconButton>
    </label>
  </CodeButtonTooltip>
);

const HidePanelButton = ({ id, handleHide }) => (
  <CodeButtonTooltip title="Ocultar Panel Editor">
    <IconButton onClick={handleHide} id={id}>
      <ChevronLeftIcon color="primary" sx={{ fontSize: FONT_SIZE }} />
    </IconButton>
  </CodeButtonTooltip>
);

export default function CodeButtons({
  runLoading,
  stopDisabled,
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
          <Grid container direction="row">
            <Grid item>
              <RunButton
                id="run-button"
                runLoading={runLoading}
                handleRun={handleRun}
              />
            </Grid>

            <Grid item>
              <StopButton
                id="stop-button"
                handleStop={handleStop}
                disabled={stopDisabled}
              />
            </Grid>

            <Grid item>
              <DownloadButton
                id="download-button"
                handleDownload={handleDownload}
              />
            </Grid>

            <Grid item>
              <UploadButton id="upload-button" handleUpload={handleUpload} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item sx={{ flexGrow: 1, height: "100%" }} />
        <Grid>
          <HidePanelButton id="hide-button" handleHide={handleHide} />
        </Grid>
      </Grid>
    </>
  );
}
