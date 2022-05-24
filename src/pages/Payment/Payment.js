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
import DividerTitle from "../../components/DividerTitle";

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
        direction="row"
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

        <Grid item xs={12} sm={10} md={8} lg={8} xl={6} sx={{ flexGrow: 0 }}>
          <Card style={{ maxWidth: "100%" }}>
            <Grid container direction="column">
              <Grid item>
                <CardHeader title={`Comprar ${course.title}`} />
              </Grid>

              <Grid item>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.img_url}
                  alt="Imagen del ambiente de robótica"
                />
              </Grid>
              <Grid item>
                <CardContent>
                  <DividerTitle sx={{ marginBottom: "1em" }}>
                    {" "}
                    Descripción
                  </DividerTitle>
                  <div style={{ padding: "0px 1em", fontSize: "1.125em" }}>
                    <Typography
                      sx={{ marginBottom: "0.4em", fontSize: "inherit" }}
                    >
                      {course.summary}
                    </Typography>

                    <Typography
                      sx={{ marginBottom: "0.4em", fontSize: "inherit" }}
                    >
                      Este curso esta pensando para personas sin experiencia en
                      programación ni robótica, cualquiera que tenga ganas puede
                      aprender.
                    </Typography>

                    <Typography
                      sx={{ marginBottom: "0.4em", fontSize: "inherit" }}
                    >
                      El curso de programación de robótica con Python incluye el
                      material docente y acceso a nuestro simulador de robótica
                      web por 4 meses.
                    </Typography>
                  </div>
                  <DividerTitle sx={{ marginBottom: "1em" }}>
                    Unidades
                  </DividerTitle>
                  <ul style={{ marginTop: "0.4em", fontSize: "1.125em"}}>
                    <li>Introducción.</li>
                    <ul>
                      <li>
                        Se presentan los fundamentos de la programación y
                        robótica. Se resuelve un ejercicio que involucra mover
                        al robot.
                      </li>
                    </ul>
                    <li>Comenzando a programar.</li>
                    <ul>
                      <li>
                        Se presentan los conceptos de variable, función y
                        algoritmos. Estos conceptos se aplican para resolver dos
                        ejercicios de movimiento del robot.
                      </li>
                    </ul>
                    <li>Activando mis sentidos: visión.</li>
                    <ul>
                      <li>
                        Se describen los sensores de un robot y su uso en el
                        control de este. Debes resolver desafíos en los cuales
                        será necesario que utilices los sensores del robot.
                      </li>
                    </ul>
                    <li>Mi primer seguidor de línea.</li>
                    <ul>
                      <li>
                        A partir del conocimiento del uso de sensores y control
                        del robot, aprenderás el concepto de control automático.
                        El desafío principal es lograr que el robot por si solo,
                        siga un camino definido sin perderse.
                      </li>
                    </ul>
                    <li>Múltiples rutas.</li>
                    <ul>
                      <li>
                        En esta unidad final debes resolver pistas grandes que
                        involucran intersecciones, detenciones y curvas
                        cerradas. Aplicarás todos los conocimientos anteriores
                        para darle autonomía a tu robot virtual.
                      </li>
                    </ul>
                  </ul>
                  <DividerTitle sx={{ marginBottom: "1em" }}>
                    Información Adicional
                  </DividerTitle>
                  
                  <ul style={{fontSize: "1.125em"}}>
                    <li>
                      La compra del curso da acceso al material docente y acceso
                      por 4 meses a la plataforma de robótica virtual web.
                    </li>
                    <li>
                      Tendrás acceso las 24 horas del día los 7 días de la
                      semana a la plataforma Gatitolabs.
                    </li>
                    <li>
                      Tendrás acceso a un chat de ayuda para resolver tus dudas
                      del curso.
                    </li>
                  </ul>

                  <Grid
                    item
                    sx={{
                      width: "100%",
                      margin: "auto",
                      marginTop: "0em",
                      padding: "0em",
                    }}
                  >
                    <DividerTitle sx={{ marginBottom: "0em" }}>
                      Pago
                    </DividerTitle>
                    <Typography align="center" sx={{ fontSize: "2em" }}>
                      {" "}
                      Método de Pago: Flow{" "}
                    </Typography>
                    <Typography align="center" sx={{ fontSize: "2em" }}>
                      {" "}
                      Total: ${course.price}{" "}
                    </Typography>
                  </Grid>
                </CardContent>
              </Grid>

              <Grid item sx={{ marginBottom: "1.5em" }}>
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
