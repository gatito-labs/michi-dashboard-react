import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const EnvCard = (props) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { envTitle, envImage, summaryContent, buttonDisabled, startServer } =
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
              <Typography>{summaryContent}</Typography>
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
