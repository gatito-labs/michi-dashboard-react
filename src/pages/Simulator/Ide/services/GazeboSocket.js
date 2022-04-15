import ReactGA from 'react-ga4';

function _sentCodeToAnalytics({token, user_name, language, code_text}) {
  fetch(`${process.env.REACT_APP_MICHI_API}/upload_code_to_s3`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
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
  onLogMessage, onSuccessMessage, onErrorMessage, onFinish, getAccessTokenSilently}) {
  
  ReactGA.event({
    category: 'Code',
    action: 'Run',
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

  getAccessTokenSilently().then((token) => {
    _sentCodeToAnalytics({
      token: token,
      user_name: user,
      language: language,
      code_text: code
    });
  });
  
}
