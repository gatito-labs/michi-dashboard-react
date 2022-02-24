import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const FONT_SIZE = "1em";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    fontSize: 18,
    fontWeight: "bold",
    height: "100%",
  },
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const CodeButtonTooltip = ({ title, children }) => (
  <LightTooltip title={title} arrow disableInteractive followCursor>
    {children}
  </LightTooltip>
);

const RunButton = ({ runLoading, handleRun }) => (
  <CodeButtonTooltip title="Lanzar programa">
    <IconButton onClick={handleRun} disabled={runLoading}>
      {runLoading ? (
        <CircularProgress color="success" style={{ fontSize: FONT_SIZE }} />
      ) : (
        <PlayCircleIcon style={{ fill: "green", fontSize: FONT_SIZE }} />
      )}
    </IconButton>
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
      <ChevronLeftIcon style={{ fill: "#7f2982", fontSize: FONT_SIZE }} />
    </IconButton>
  </CodeButtonTooltip>
);

export default function CodeButtons({
  runLoading,
  handleRun,
  handleStop,
  handleDownload,
  handleUpload,
  handleHide
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
          <RunButton runLoading={runLoading} handleRun={handleRun} />
          <StopButton handleStop={handleStop} />
          <DownloadButton handleDownload={handleDownload} />
          <UploadButton handleUpload={handleUpload} />
        </Grid>
        <Grid item sx={{ flexGrow: 1, height: "100%" }} />
        <Grid>
          <HidePanelButton handleHide={handleHide} />
        </Grid>
      </Grid>
    </>
  );
}
