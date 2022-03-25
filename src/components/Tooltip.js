import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.secondary.dark,
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[1],
    fontSize: 18,
    fontWeight: "bold",
    height: "100%",
  },
}));

export const CodeButtonTooltip = ({ title, children }) => (
  <LightTooltip title={title} arrow followCursor>
    {children}
  </LightTooltip>
);
