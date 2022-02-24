import { memo } from "react";
import { Grid } from "@mui/material";
import { ReactTerminal } from "react-terminal";

// esta terminal no viene implementada con saltos de línea, por lo que,
// debemos simularlo nosotros con JSX [solución entregada por el autor de react-terminal]
const textToJsx = (text) => {
  const splittedText = text.split("\n");
  const output = [];
  splittedText.forEach((line, i) => {
    output.push(<Grid container fontSize={16} lineHeight={1.2} marginBottom={2} key={i}>{line}</Grid>);
  });
  return output;
};

const Terminal = memo(({output}) => {
  const formattedOutput = textToJsx(output);
  // zIndex de blockly es superior a 60 al parecer
  
  return (
    <Grid height="100%">
      <ReactTerminal
        welcomeMessage={formattedOutput}
        enableInput={false}
        prompt=""
      />
    </Grid>
  );
});

export default Terminal; 