import React, { useState, useCallback } from "react";

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
import { usePayment } from "../../store";
import { useNavigate } from "react-router-dom";

const EnvCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const navigate = useNavigate();
  const { setCourse } = usePayment();

  const buyCourse = useCallback(() => {
    setCourse(course);
    navigate("/payment")
  }, [setCourse, course, navigate]);

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
        <CardHeader title={course.title} />

        <Grid item>
          <CardActionArea onClick={handleExpandClick}>
            <CardMedia
              component="img"
              height="194"
              image={course.envImage}
              alt="Imagen del ambiente de robótica"
            />

            <CardContent>
              <Typography>{course.summaryContent}</Typography>
            </CardContent>
          </CardActionArea>
        </Grid>

        <Grid item>
          <CardActions disableSpacing>
            <Tooltip title={"Comprar ."}>
              <span>
                <Button
                  variant="contained"
                  color="success"
                  style={{ marginLeft: "auto" }}
                  onClick={() => buyCourse()}
                >
                  Comprar ${course.price}
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
