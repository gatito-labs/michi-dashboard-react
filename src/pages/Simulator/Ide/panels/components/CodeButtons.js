import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const FONT_SIZE = "4vh";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    fontSize: 18,
    fontWeight: "bold",
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

const CodeButtonTooltip = ({title, children}) => (
  <LightTooltip title={title} arrow disableInteractive followCursor>
    {children}
  </LightTooltip>
)

const RunButton = ({runLoading, handleRun}) => (
  <CodeButtonTooltip title="Lanzar programa">
    <IconButton onClick={handleRun} disabled={runLoading}>
      {
        runLoading ?
        <CircularProgress color="success" style={{fontSize: FONT_SIZE}}/> :
        <PlayCircleIcon style={{fill: "green", fontSize: FONT_SIZE}}/>
      }
    </IconButton>
  </CodeButtonTooltip>
);

const StopButton = ({handleStop}) => (
  <CodeButtonTooltip title="Detener programa">
    <IconButton onClick={handleStop}>
      <StopCircleIcon style={{fill: "red", fontSize: FONT_SIZE}} />
    </IconButton>
  </CodeButtonTooltip>
);

const DownloadButton = ({handleDownload}) => (
  <CodeButtonTooltip title="Descargar archivo">
    <IconButton onClick={handleDownload}>
      <FileDownloadIcon style={{fill: "blue", fontSize: FONT_SIZE}}/>
    </IconButton>
  </CodeButtonTooltip>
);

const Input = styled("input")({
  display: "none",
});

const UploadButton = ({handleUpload}) => (
  <CodeButtonTooltip title="Subir archivo">
    <label htmlFor="upload-icon-button-file">
      <Input type="file" id="upload-icon-button-file" onChange={handleUpload}/>
      <IconButton aria-label="upload picture" component="span">
        <FileUploadIcon style={{fill: "blue", fontSize: FONT_SIZE}} />
      </IconButton>
    </label>
  </CodeButtonTooltip>
);

export default function CodeButtons({runLoading, handleRun, handleStop, handleDownload, handleUpload, sx}) {
    return (
      <Box id="code-buttons" sx={{...sx, alignItems: "center"}}>
          <RunButton runLoading={runLoading} handleRun={handleRun} />
          <StopButton handleStop={handleStop} />
          <DownloadButton handleDownload={handleDownload} />
          <UploadButton handleUpload={handleUpload} />
      </Box>
    )
};