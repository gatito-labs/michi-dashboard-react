import { ReactTerminal } from "react-terminal";

export default function Terminal({output, ...props}) {
  function owo() {
    console.log("uwu");
  }
  
  return (
    <ReactTerminal
      welcomeMessage={output}
      enableInput={false}
      showControlButtons={false}
      showControlBar={false}
      prompt=""
      {...props} />
  )
}