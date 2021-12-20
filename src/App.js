// in src/App.js
import * as React from "react";
// import { PostList, PostEdit, PostCreate } from "./utils/posts";
// import Dashboard from "./pages/Dashboard";
// import authProvider from "./utils/authProvider";
// import jsonServerProvider from "ra-data-json-server";
// import RoboticsEnvSelector from "./pages/roboticsEnvs";
// import EnvView from "./pages/envMain";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import LoginPage from "./pages/Login/login"
// import loginPage from "./pages/login";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/login" component={LoginPage} /> */}
        <Route path="/*" element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
