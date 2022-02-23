import { Box } from "@mui/material";
import { memo } from "react";
import { ReactTerminal } from "react-terminal";

const textToJsx = (text) => {
  const splittedText = text.split("\n");
  const output = [];
  splittedText.forEach(line => {
    output.push(<Box fontSize={16} lineHeight={1.2} marginBottom={2}>{line}</Box>);
  });
  return output;
};

const Terminal = memo(({output, ...props}) => {
  const formattedOutput = textToJsx(output);
  // zIndex de blockly es superior a 60 al parecer
  
  return (
    <Box backgroundColor="cyan" position="absolute" zIndex={500} width="100%" height="50%" bottom={0} overflow="hidden">
      <ReactTerminal
        welcomeMessage={formattedOutput}
        enableInput={false}
        prompt=""
        {...props}
      />
    </Box>
  );
});

export default Terminal; 