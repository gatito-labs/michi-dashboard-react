import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePayment } from "../../store";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import {
  LOADING_PAYMENT_STATUS,
  PAYMENT_PENDING,
  PAYMENT_COMPLETED,
  PAYMENT_REJECTED,
  PAYMENT_ABORTED,
  PAYMENT_NOT_FOUND,
} from "../../store/paymentReducer";

export const PaymentConfirmation = () => {
  const { checkPaymentStatus, paymentStatus, paymentInfo, error } =
    usePayment();

  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("No hay compra asociada");
  const [timer, setTimer] = useState(null);
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const loadStatus = useCallback(
    (forceLoad = false) => {
      if (
        !forceLoad &&
        (paymentStatus === LOADING_PAYMENT_STATUS ||
          paymentStatus === PAYMENT_COMPLETED ||
          paymentStatus === PAYMENT_REJECTED ||
          paymentStatus === PAYMENT_ABORTED ||
          paymentStatus === PAYMENT_PENDING ||
          paymentStatus === PAYMENT_NOT_FOUND)
      ) {
        return;
      }

      checkPaymentStatus(searchParams.get("token", null));
    },
    [checkPaymentStatus, searchParams, paymentStatus]
  );

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  useEffect(() => {
    if (paymentStatus === PAYMENT_COMPLETED) {
      setTitle(
        `¡Muchas gracias por tu compra! n°${paymentInfo.paymentCommerceOrder}`
      );
      setMsg(
        `Muchas gracias por tu compra! Ya puedes acceder a tu curso desde el selector de Ambientes:`
      );
    } else if (paymentStatus === PAYMENT_REJECTED) {
      setTitle(`Compra no concretada`);
      setMsg(
        `No hemos podido concretar tu compra (n°${paymentInfo.paymentCommerceOrder}) debido a que el pago fue rechazado. Puedes volver a intentarlo en la Tienda.\nSi crees que esto es un error porfavor contactanos a soporte@gatitolabs.cl con tu número de compra. `
      );
    } else if (paymentStatus === PAYMENT_ABORTED) {
      setTitle(`Compra no concretada`);
      setMsg(
        `No hemos podido concretar tu compra (n°${paymentInfo.paymentCommerceOrder}) debido a que el pago no fue concretado. Puedes volver a intentarlo en la Tienda.\nSi crees que esto es un error porfavor contactanos a soporte@gatitolabs.cl con tu número de compra. `
      );
    } else if (paymentStatus === PAYMENT_NOT_FOUND) {
      setTitle(`Pago no existente`);
      setMsg(
        `No hemos encontrado un pago asociado a este token.\nSi crees que esto es un error porfavor contactanos a soporte@gatitolabs.cl con tu número de compra. `
      );
    } else if (paymentStatus === PAYMENT_PENDING) {
      setTitle(`Compra pendiente`);
      setMsg(
        <>
          Esperando la confirmación de tu compra n°$
          {paymentInfo.paymentCommerceOrder}, porfavor espera unos segundos!{" "}
          <br /> Si cancelaste la compra, puedes volver a inicio
        </>
      );

      setTimer(
        setTimeout(() => {
          console.log("checking status again");
          loadStatus(true);
        }, 15000)
      );
    }
  }, [paymentStatus, paymentInfo.paymentCommerceOrder, loadStatus]);

  if (paymentStatus !== LOADING_PAYMENT_STATUS) {
    return (
      <Grid
        container
        sx={{
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          padding: "4em",
        }}
      >
        <Grid item xs={8} md={6} xl={4}>
          <Card>
            <Grid container direction="column">
              <Grid item>
                <CardHeader title={title} />
              </Grid>

              <Grid item>
                {/*   <CardMedia
                    component="img"
                    height="194"
                    image={course.image}
                    alt="Imagen del ambiente de robótica"
                  /> */}

                <CardContent>{msg}</CardContent>
              </Grid>
              <Grid item>
                <CardActions disableSpacing>
                  <Tooltip title={"Ir a ver Ambientes"}>
                    <span>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginLeft: "auto" }}
                        onClick={() => navigate("/dashboard")}
                      >
                        Ir a Ambientes
                      </Button>
                    </span>
                  </Tooltip>
                </CardActions>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    );
  } else if (error) {
    return (
      <Grid
        container
        direction="column"
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "4em",
        }}
      >
        <Grid item xs={8} md={6} xl={4}>
          <Alert severity="error">
            <Typography>{error}</Typography>
          </Alert>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        direction="column"
        sx={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          padding: "4em",
        }}
      >
        <Grid item xs={8} md={6} xl={4}>
          <CircularProgress />
        </Grid>
        <Grid item xs={8} md={6} xl={4}>
          <Typography> Cargando información del pago </Typography>
        </Grid>
      </Grid>
    );
  }
};
