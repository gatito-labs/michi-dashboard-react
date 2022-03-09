import { TerminalContextProvider } from "react-terminal";
import Ide from "./Ide";

const Simulator = () => {
  return (
    <TerminalContextProvider>
      <Ide />
    </TerminalContextProvider>
  );
};

export default Simulator;