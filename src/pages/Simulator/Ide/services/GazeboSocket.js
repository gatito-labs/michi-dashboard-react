export function sendCodeToRobot({ws_url, code, onLogMessage, onSuccessMessage, onErrorMessage, onFinish}) {
  const ws = new WebSocket(ws_url);

  ws.onopen = event => {
    ws.send(code);
    console.log("Socket opened");
  }

  ws.onmessage = event => {
    const data = JSON.parse(event.data);
    const type = data.type;
    const msg = data.msg;
    console.log("Socket new message:", data);
    switch (type) {
      case "log":
        onLogMessage(msg);
        break;
      case "success":
        onSuccessMessage(msg);
        ws.close();
        break
      case "error":
        onErrorMessage(msg);
        ws.close();
        break;
      default:
    };
  }
  
  ws.onclose = event => {
    console.log("Socket closed:", event);
    onFinish();
  }

  ws.onerror = event => {
    console.log("Socket error:", event);
    onFinish();
  }
}