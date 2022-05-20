import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";


const EnvCard = (props) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { envTitle, envImage, description, buttonDisabled, startServer } =
    props;

  return (
    <Card sx={{ height: "100%" }}>
      <Grid
        container
        direction="column"
        sx={{
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <CardHeader title={envTitle} />

        <Grid item>
          <CardActionArea onClick={handleExpandClick}>
            <CardMedia
              component="img"
              height="194"
              image={envImage}
              alt="Imagen del ambiente de robótica"
            />

            <CardContent>
              <Typography>{description}</Typography>
            </CardContent>
          </CardActionArea>
        </Grid>

        <Grid item>
          <CardActions disableSpacing>
            <Tooltip
              title={
                buttonDisabled
                  ? "Debes detener el ambiente actual para iniciar uno nuevo."
                  : "Iniciar ambiente."
              }
            >
              <span>
                <Button
                  variant="contained"
                  color="success"
                  style={{ marginLeft: "auto" }}
                  onClick={() => startServer(envTitle)}
                  disabled={buttonDisabled}
                >
                  Iniciar
                </Button>
              </span>
            </Tooltip>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default EnvCard;
