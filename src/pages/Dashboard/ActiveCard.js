import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";

const ActiveCard = ({
  envTitle,
  envImage,
  description,
  buttonDisabled,
  stopServer,
}) => {
  let active = true;

  return (
    <Card>
      <CardHeader title={`Ambiente Activo: ${envTitle}`} />
      <Grid>
        <CardMedia
          component="img"
          height="194"
          image={envImage}
          alt="Imagen del ambiente de robótica"
        />

        <Grid container direction="column" justifyContent="space-between">
          <CardContent>
            <Typography>{description}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            {active && (
              <div style={{ marginLeft: "auto" }}>
                <Link to={"/simulador"}>
                  <Button
                    variant="contained"
                    color="success"
                    style={{ marginRight: "0.5em" }}
                    disabled={buttonDisabled}
                  >
                    Ir
                  </Button>
                </Link>

                <Button
                  variant="contained"
                  color="error"
                  style={{ marginLeft: "auto" }}
                  onClick={stopServer}
                  disabled={buttonDisabled}
                >
                  Detener
                </Button>
              </div>
            )}
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ActiveCard;
