import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "white",
  border: "2px solid #999",
  boxShadow: 50,
  p: 4,
  alignItems: "center",
  padding: "2em",
};

const DownloadModal = ({ open, handleClose, handleDownload }) => {
  const [filename, setFilename] = useState("");
  const [error, setError] = useState(false);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-descarga-codigo"
      aria-describedby="Este modal es para descargar tu código, ingresa el nombre del archivo."
    >
      <Grid container direction="column" style={style}>
        <Grid item>
          <h2> Descarga tu código </h2>
        </Grid>
        <Grid item>
          <TextField
            required
            error={error}
            value={filename}
            onChange={(e) => {
              setError(false);
              setFilename(e.target.value);
            }}
            label="nombre archivo"
            id="outlined-start-adornment"
            sx={{ m: 1, width: "25ch" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">.ino</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              if (filename) {
                handleDownload(filename);
                setFilename("");
                setTimeout(handleClose, 600);
              } else {
                setError(true);
              }
            }}
          >
            {" "}
            Descargar{" "}
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default DownloadModal;
