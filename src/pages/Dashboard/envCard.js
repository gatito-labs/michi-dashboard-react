// import * as React from "react";
import React, { useState } from "react";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const EnvCard = (props) => {
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const {
    envTitle,
    envImage,
    expandedContent,
    summaryContent,
    buttonDisabled,
    active,
    startServer,
    stopServer,
    goToServer,
  } = props;

  return (
    <Card>
      <CardActionArea onClick={handleExpandClick}>
        <CardHeader title={envTitle} />
        <CardMedia
          component="img"
          height="194"
          image={envImage}
          // alt=""
        />

        <CardContent> {summaryContent} </CardContent>
      </CardActionArea>

      <CardActions disableSpacing>
        {!active && (
          <Button
            variant="contained"
            color="success"
            style={{ marginLeft: "auto" }}
            onClick={() => startServer(envTitle)}
            disabled={buttonDisabled}
          >
            Iniciar
          </Button>
        )}

        {active && (
          <div style={{ marginLeft: "auto"}}>
            <Link to={"/simulator"}>
              <Button
                variant="contained"
                color="success"
                style={{marginRight: "0.5em"}}
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

      {/* <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>{expandedContent}</CardContent>
      </Collapse> */}
    </Card>
  );
};

export default EnvCard;
