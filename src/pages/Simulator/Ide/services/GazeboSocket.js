import ReactGA from 'react-ga4';

function _sentCodeToAnalytics({user_name, language, code_text}) {
  fetch("https://api.gatitolabs.cl/michi-api/upload_code_to_s3", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_CODE_TO_S3_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_name: user_name,
      language: language,
      code_text: code_text
    })
  })
}


export function sendCodeToRobot({ws_url, user, code, language,
  onLogMessage, onSuccessMessage, onErrorMessage, onFinish}) {
  
  ReactGA.event({
    category: 'Code',
    action: 'Run',
  });

  _sentCodeToAnalytics({
    user_name: user,
    language: language,
    code_text: code
  });

  const ws = new WebSocket(ws_url);

  ws.onopen = () => {
    let msg = { type: "run", language: language, body: code };
    // console.log(msg);
    // console.log("Socket opened");
    ws.send(JSON.stringify(msg));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const type = data.type;
    const msg = data.msg;
    // console.log("Socket new message:", data);

    switch (type) {
      case "log":
        onLogMessage(msg);
        break;
      case "success":
        onSuccessMessage(msg);
        ws.close();
        break;
      case "error":
        onErrorMessage(msg);
        ws.close();
        break;
      default:
    }
  };

  ws.onclose = (event) => {
    // console.log("Socket closed:", event);
    onFinish();
  };

  ws.onerror = (event) => {
    // console.log("Socket error:", event);
    onErrorMessage("Falló conexión al servidor");
    onFinish();
  };
}
