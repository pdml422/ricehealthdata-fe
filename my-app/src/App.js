import React from "react";
import { Routes, Route } from 'react-router-dom';
import RegisterPage from "./Pages/Register";
import LoginPage from "./Pages/Login";


function App() {
  return (
      <div className="form">
        <Routes>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </div>
  );
}

export default App;
