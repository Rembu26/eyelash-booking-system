import React from "react";
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<LandingPage/>}  />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}  />
      </Routes>

        <ToastContainer
        position="top-center" 
        autoClose={3000}
        theme="colored"
        />
    </Router>

    
  );

}

export default App;


