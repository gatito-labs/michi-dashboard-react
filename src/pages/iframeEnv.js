// import * as React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import Grid from "@mui/material/Grid";
import Iframe from "react-iframe";

const IframeEnv = () => {
  const { user } = useAuth0();

  return (
    <Grid sx={{ minHeight: "900px", minWidth: "500px" }}>
      <Iframe
        title="test"
        src={`https://app.gatitolabs.cl/user/${user.email}/`}
        frameborder="0"
        height="100%"
        width="100%"
      ></Iframe>
    </Grid>
  );
};

export default IframeEnv;
