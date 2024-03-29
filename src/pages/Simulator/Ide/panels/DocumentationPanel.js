import Iframe from "react-iframe";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const OpenPopupButton = ({ url_doc }) => (
  <IconButton
    sx={{
      position: "absolute",
      right: "10px",
      bottom: "10px",
      backgroundColor: "secondary.main",
    }}
    onClick={() =>
      window.open(
        url_doc ? url_doc : `${process.env.REACT_APP_DOCUMENTATION_URL}`,
        "_blank",
        "height=900,width=800,menubar=0,location=0,status=0,titlebar=0,toolbar=0,left=500,top=50"
      )
    }
  >
    <OpenInNewIcon style={{ fill: "white", fontSize: "6vh" }} />
  </IconButton>
);

export default function PanelDocumentacion({ url_doc }) {
  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      <Iframe
        className="panel"
        id="documentationFrame"
        title="Documentación"
        width="100%"
        height="100%"
        frameBorder={0}
        src={url_doc ? url_doc : `${process.env.REACT_APP_DOCUMENTATION_URL}`}
        sx={{ overflow: "hidden" }}
      ></Iframe>
      <OpenPopupButton url_doc={url_doc} />
    </Box>
  );
}
