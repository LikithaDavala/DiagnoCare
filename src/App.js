import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./Pages/RegistrationForm/registrationForm";
import LoginPage from "./Pages/LoginPage/loginPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/login" element={<LoginPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;