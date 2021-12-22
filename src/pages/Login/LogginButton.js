import React from "react";
// import { userLogin as userLoginAction } from 'react-admin';

import { withStyles, createStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";

const styles = ({ spacing }) =>
  createStyles({
    button: {
      width: "100%",
    },
    icon: {
      marginRight: spacing.unit,
    },
  });

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      variant="contained"
      type="submit"
      color="primary"
      onClick={loginWithRedirect}
    >
      Ingresar con OAuth
    </Button>
  );
};

export default withStyles(styles)(LoginPage);
