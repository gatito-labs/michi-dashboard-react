import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export const PanelButton = ({name, selected, onClickHandler}) => (
  <Grid display="flex" sx={{flexGrow: 1,}}>
    <Button
      sx={{ width: "100%", borderRadius: 0}}
      variant={selected ? "contained" : "outlined"}
      onClick={onClickHandler}
      color="secondary"
    >
      {name}
    </Button>
  </Grid>
);

export const Panel = ({selected, children}) => (
  <Box sx={{display: selected ? "flex" : "none", height:"100%"}}>
    {children}
  </Box>
);
