import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export const PanelButton = ({name, selected, onClickHandler}) => (
  <Box display="flex">
    <Button
      sx={{flex: 1, borderRadius: 0}}
      variant={selected ? "contained" : "outlined"}
      onClick={onClickHandler}
      color="secondary"
    >
      {name}
    </Button>
  </Box>
);

export const Panel = ({selected, children}) => (
  <Box display={selected ? "flex" : "none"}>
    {children}
  </Box>
);
