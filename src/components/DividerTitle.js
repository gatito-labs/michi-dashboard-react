import useTheme from "@mui/styles/useTheme";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const DividerTitle = ({ children, sx }) => {
  const theme = useTheme();
  return (
    <Divider
      color="primary"
      sx={{
        margin: "2em",
        "&::before": { width: "2%", borderColor: theme.palette.primary.light },
        "&::after": { borderColor: theme.palette.primary.light },
        ...sx
      }}
      textAlign="left"
      variant="middle"
    >
      <Chip
        color="primary"
        label={
          <Typography color="white" variant="subtitle2">
            {children}
          </Typography>
        }
      ></Chip>
    </Divider>
  );
};

export default DividerTitle;
