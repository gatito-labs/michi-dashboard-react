import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Iframe from "react-iframe";
import Alert from "@mui/material/Alert";
import { useHubServer } from "../../store";

const IframeEnv = ({ user }) => {
  const { loadingStatus, serverRunning } = useHubServer();

  if (loadingStatus || !serverRunning) {
    return (
      <Grid
        container
        direction="column"
        sx={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "3em",
        }}
      >
        {loadingStatus ? (
          <Grid item>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid item>
            <Alert severity="error" sx={{ marginBottom: "2em" }}>
              No hay ningún ambiente de simulación corriendo, debes iniciar un
              ambiente en "Mis Ambientes".
            </Alert>
          </Grid>
        )}
      </Grid>
    );
  } else {
    return (
      <Iframe
        title="test"
        src={`https://app.gatitolabs.cl/user/${user.email}/`}
        frameBorder="0"
        height="100%"
        width="100%"
        sx={{ border: "none" }}
      />
    );
  }
};

export default IframeEnv;
