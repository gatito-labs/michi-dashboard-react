import React, { useEffect, useCallback } from "react";
import { usePayment } from "../../store";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";

const Payment = () => {
  const {
    course,
    createPayment,
    paymentInfo,
    creatingPayment,
    paymentCreated,
    error,
    clearErrors,
  } = usePayment();

  useEffect(() => {
    if (paymentCreated) {
      window.location.href = `${paymentInfo.paymentRequestURL}?token=${paymentInfo.paymentRequestToken}`;
    }
  }, [paymentCreated, paymentInfo]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!course) {
      navigate("/dashboard");
    }
  }, [course, navigate]);

  const buyCourse = useCallback(() => {
    createPayment();
  }, [createPayment]);

  if (creatingPayment || paymentCreated) {
    return (
      <Grid
        container
        direction="column"
        sx={{ alignItems: "center", justifyContent: "center", padding: "3em" }}
      >
        <Grid item xs={8} md={6} xl={4}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  } else if (course !== null && course !== undefined) {
    return (
      <Grid
        container
        direction="column"
        sx={{
          alignItems: "center",
          justifyContent: "center",
          padding: "3em",
          gap: "1em",
        }}
      >
        {error && (
          <Alert severity="error" onClose={clearErrors}>
            {" "}
            {error}{" "}
          </Alert>
        )}

        <Grid item xs={8} md={6} xl={4}>
          <Card>
            <Grid container direction="column">
              <Grid item>
                <CardHeader title={`Comprar ${course.title}`} />
              </Grid>

              <Grid item>
                <CardMedia
                  component="img"
                  height="194"
                  image={course.img_url}
                  alt="Imagen del ambiente de robótica"
                />
                <CardContent>
                  <Typography>{course.summaryContent}</Typography>
                </CardContent>
              </Grid>

              <Grid item sx={{ width: "100%", margin: "auto" }}>
                <Typography align="center"> Método de Pago: Flow </Typography>
                <Typography align="center"> Total: ${course.price} </Typography>
              </Grid>

              <Grid item>
                <CardActions disableSpacing>
                  <Grid
                    container
                    direction="row"
                    sx={{
                      width: "100%",
                      justifyContent: "center",
                      gap: "2em",
                      alignItems: "center",
                    }}
                  >
                    <Grid item>
                      <Tooltip title={"Comprar a través de Flow"}>
                        <span>
                          <Button
                            variant="contained"
                            color="success"
                            style={{
                              width: "120px",
                              height: "38px",
                              marginLeft: "auto",
                              backgroundImage: `url(/btn-flow-blanco.png)`,
                            }}
                            onClick={buyCourse}
                          ></Button>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title={"Cancelar y volver al inicio"}>
                        <span>
                          <Link to="/dashboard">
                            <Button
                              variant="contained"
                              color="error"
                              style={{ marginLeft: "auto", height: "38px" }}
                            >
                              Cancelar
                            </Button>
                          </Link>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return <Grid> Error en la página que buscas! </Grid>;
  }
};

export default Payment;
