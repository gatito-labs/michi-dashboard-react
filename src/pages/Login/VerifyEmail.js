import { useAuth0 } from "@auth0/auth0-react";
import { useState, useCallback } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Navigate, useSearchParams } from "react-router-dom";

export const VerifyEmail = () => {
  const { loginWithRedirect } = useAuth0();
  const [searchParams] = useSearchParams();
  let success = searchParams.get("success") === "true";
  let msg = searchParams.get("message");

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ margin: "2em auto", gap: "1em" }}
    >
      <Grid item>
        {success ? (
          <Alert>
            Correo electrónico verificado, haz click en continuar para iniciar
            sesión.
          </Alert>
        ) : (
          <Alert severity="error"> {msg} </Alert>
        )}
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={() => loginWithRedirect()}>
          Continuar
        </Button>
      </Grid>
    </Grid>
  );
};

export const EmailNotVerified = () => {
  const { user, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [emailSent, setEmailSent] = useState(false);
  const [askingEmail, setAskingEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const resendEmailVerification = useCallback(async () => {
    setAskingEmail(true);
    getAccessTokenSilently().then((token) => {
      fetch(`${process.env.REACT_APP_MICHI_API}resend_verification_email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.sub,
          identity: {
            user_id: user.sub.substring(user.sub.indexOf("|") + 1),
            provider: user.sub.substring(0, user.sub.indexOf("|")),
          },
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            setEmailSent(true);
          } else {
            setEmailError(true);
          }
          setAskingEmail(false);
        })
        .catch(() => {
          setEmailError(true);
          setAskingEmail(false);
        });
    });
  }, [user, getAccessTokenSilently]);

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      sx={{ margin: "2em auto", gap: "1em" }}
    >
      {askingEmail ? (
        <CircularProgress />
      ) : emailSent ? (
        <Alert severity="info">
          Acabamos de enviar un correo de verificación a tu casilla {user.email}. 
          Sigue las instrucciones en este para continuar.{" "}
        </Alert>
      ) : emailError ? (
        <Alert severity="error">
          Ocurrió un error inesperado al enviar tu correo de verificación,
          porfavor contáctanos enviando un correo{" "}
          <a href="mailto:soporte@gatitolabs.cl">soporte@gatitolabs.cl</a> o a
          través del canal de soporte en Discord.
        </Alert>
      ) : (
        <Alert severity="info">
          <Typography>
            Debes verificar tu correo electrónico antes de continuar.
          </Typography>
          <br /> <div style={{ margin: "1em" }} />
          Si no encuentras el correo que te enviamos{" "}
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              display: "inline",
              margin: "0",
              padding: "0",
            }}
            onClick={resendEmailVerification}
          >
            {"  "} haz click aquí para reenviar uno.
          </button>
          <br />
        </Alert>
      )}

      <Alert severity="info">
        Si ya verificaste tu correo  has click en continuar:
        
        <Grid container sx={{width: "100%", justifyContent: "center", margin: "1em 0em"}}>
          <Grid item>
          <Button variant="contained" sx={{margin: "auto"}} onClick={() => loginWithRedirect()}>
            Continuar
          </Button>
          </Grid>
        </Grid>
      </Alert>
    </Grid>
  );
};
