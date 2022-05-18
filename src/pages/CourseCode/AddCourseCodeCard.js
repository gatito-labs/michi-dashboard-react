import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePayment } from "../../store";

const AddCourseCodeCard = () => {
  const [code, setCode] = useState("");
  const {
    error,
    redeemCourse,
    clearErrors,
    redeemCourseLoading,
    redeemCourseSuccess,
  } = usePayment();

  const navigate = useNavigate();
  return (
    <Card sx={{ paddingBottom: "1em" }}>
      <CardHeader title={"Añadir Código de Curso"} />

      <Grid
        container
        direction="column"
        justifyContent="space-between"
        sx={{ alignItems: "center", width: "100%", gap: "1em" }}
      >
        {redeemCourseSuccess ? (
          <>
            <Grid item sx={{ width: "100%" }}>
              <CardContent>
                <Typography color="green">!Código de curso válido!</Typography>
                <Typography>
                  Bienvenido, puedes revisar tus cursos en Mis Ambientes.
                </Typography>
              </CardContent>
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "auto" }}
                onClick={() => navigate("/ambientes")}
              >
                Ir a Mis Ambientes
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid item sx={{ width: "100%" }}>
              <CardContent>
                <Typography>
                  Si eres parte de un taller, ingresa el código asociado y obtén
                  acceso a los ambientes disponibles para ti.
                </Typography>
              </CardContent>
            </Grid>

            {error && (
              <Grid>
                <Alert severity="error" onClose={clearErrors}>
                  {error}
                </Alert>
              </Grid>
            )}

            <Grid item>
              <TextField
                error={error !== ""}
                disabled={redeemCourseLoading}
                label="Código"
                value={code}
                style={{ margin: "auto" }}
                onChange={(e) => setCode(e.target.value)}
              />
            </Grid>

            <Grid item>
              {redeemCourseLoading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "auto" }}
                  onClick={() => redeemCourse(code)}
                >
                  Añadir Código de Curso
                </Button>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );
};

export default AddCourseCodeCard;
