// in src/App.js
import * as React from "react";
import { Routes, Route} from "react-router-dom";

import Home from "./pages/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import LoginPage from "./pages/Login/LogginButton";


function App() {
  const theme = useTheme();

  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/*" element={ <Home/> } /> :
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
