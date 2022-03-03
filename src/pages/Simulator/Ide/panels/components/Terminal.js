import { memo, useState } from "react";
import { Grid, ButtonBase } from "@mui/material";
import { ReactTerminal } from "react-terminal";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// esta terminal no viene implementada con saltos de línea, por lo que,
// debemos simularlo nosotros con JSX [solución entregada por el autor de react-terminal]

const textToJsx = (text) => {
  const splittedText = text.split("\n");
  const output = [];
  splittedText.forEach((line, i) => {
    output.push(
      <Grid
        fontSize={16}
        lineHeight={1}
        marginLeft={1}
        marginBottom={2}
        key={i}
      >
        {line}
      </Grid>
    );
  });
  return output;
};

const Terminal = memo(({ output, onHide }) => {
  const [hidden, setHidden] = useState(false);
  const formattedOutput = textToJsx(output);

  return (
    <Grid
      item
      sx={{
        width: "100%",
        minHeight: "25px",
        position: "relative",
      }}
    >
      <Grid
        backgroundColor="#e0dcdc"
        height="25px"
        width="100%"
        position="absolute"
        zIndex="1"
        textAlign="center"
      >
        <ButtonBase
          aria-label="hide terminal"
          onClick={() => {
            setHidden(!hidden);
            onHide();
          }}
          sx={{ height: "100%", width: "100%" }}
        >
          {hidden ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </ButtonBase>
      </Grid>

      { !hidden && (
        <>
          <Grid>
            <ReactTerminal
              welcomeMessage={formattedOutput}
              enableInput={false}
              prompt=""
            />
          </Grid>
        </>
      )}
    </Grid>
  );
});

export default Terminal;
