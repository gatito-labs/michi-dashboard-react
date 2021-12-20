import React from "react";

import EnvCard from "../components/envCard";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <Grid container spacing={2} >
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <EnvCard
          envTitle="Seguidor de Línea"
          expandedContent={
            <React.Fragment>
              <Typography>Ambiente de Seguidor de Linea ....</Typography>
              <Typography>Ambiente de Seguidor de Linea ....</Typography>
            </React.Fragment>
          }
          envImage={`${process.env.PUBLIC_URL}/static/cards/gato1.jpg`} 
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <EnvCard
          envTitle="RosBot"
          expandedContent={
            <React.Fragment>
              <Typography>Ambiente de Rosbot ....</Typography>
              <Typography>Ambiente de Rosbot ....</Typography>
            </React.Fragment>
          }
          envImage={`${process.env.PUBLIC_URL}/static/cards/gato2.jpeg`} 
        />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
