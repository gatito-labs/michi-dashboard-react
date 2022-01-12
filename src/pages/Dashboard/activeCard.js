import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const ActiveCard = (props) => {
  const { envTitle, envImage, summaryContent, buttonDisabled, stopServer } =
    props;

  let active = true;

  return (
    <Card>
      <CardHeader title={`Ambiente Activo: ${envTitle}`} />
      <Box sx={{ display: "flex" }}>
        <CardMedia
          component="img"
          height="194"
          image={envImage}
          alt="Imagen del ambiente de robótica"
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <CardContent>
            <Typography>{summaryContent}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            {active && (
              <div style={{ marginLeft: "auto" }}>
                <Link to={"/simulator"}>
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
        </Box>
      </Box>
    </Card>
  );
};

export default ActiveCard;
