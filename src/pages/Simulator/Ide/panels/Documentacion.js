import Iframe from "react-iframe";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const OpenPopupButton = () => (
  <IconButton
    sx={{position: "absolute", right: "2%", bottom: "2%", backgroundColor: "secondary.main"}}
    onClick={() => window.open(
      `${process.env.REACT_APP_DOCUMENTATION_URL}`,
      "_blank",
      "height=900,width=800,menubar=0,location=0,status=0,titlebar=0,toolbar=0,left=500,top=50"
    )}
  >
    <OpenInNewIcon style={{fill: "white", fontSize: "6vh"}} />
  </IconButton>
);

export default function PanelDocumentacion() {
  return (
    <Box position="relative">
      <OpenPopupButton />
      <Iframe
        className="panel"
        id="documentationFrame"
        title="Documentación"
        width="100%"
        height="100%"
        frameBorder={0}
        src={`${process.env.REACT_APP_DOCUMENTATION_URL}`}
      ></Iframe>
    </Box>
  )
}

// react context para obtener el user en el dominio