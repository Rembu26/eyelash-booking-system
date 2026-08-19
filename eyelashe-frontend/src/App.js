import React from "react";
import {BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//LOGIN && REISTERING PAGES
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Splash from "./pages/Splash";

//ADMIN PAGES
import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./adminSubsystem/AdminServices";
import AdminAppointment from "./adminSubsystem/AdminAppointment";
import AdminClients from "./adminSubsystem/AdminClients";
import AdminStaff from "./adminSubsystem/AdminStaff";
import AdminSettings from "./adminSubsystem/AdminSettings";

//STAFF PAGES 
import StaffDashboard from "./pages/StaffDashboard";
import AddService from "./StaffSubSystem/MyServices"
import MyServices from "./StaffSubSystem/MyServices";



//CUSTOMER PAGES
import CustomerDashboard from "./pages/CustomerDashboard";


import './styles.css';

//Protected route component to guard dashboard routes
const ProtectedRoute = ({ children,allowedRoles }) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user ?.role ;

    if(!token){
        return <Navigate to="/login" />; // Redirect to login if not authenticated
    }

    if(allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to="/login" />; // Redirect to login if role is not allowed
    }

    return children;
}

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user ?.role ;


  if (token && role) {
    return <Navigate to={`/${role}-dashboard`} />; // Redirect to respective dashboard if already authenticated
  }
  return children;
}



function App() {
  return (
  
    
    <Router>
      

      <Routes>

        <Route path="/" element={<LandingPage/>}  />


        <Route path="/login" element={
          
            <Login />
         }
        />
        <Route path="/test" element={ <h1>Test route works </h1> } />
          <Route path="/splash" element={< Splash />} 
          />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/staff-dashboard" element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />

        <Route path="/customer-dashboard" element={
          <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
          </ProtectedRoute>
        } />

        //STAFF PAGES
        <Route path="/staff-dashboard/StaffSubSystem/MyServices" element={<MyServices />} />
        <Route path="/staff-dashboard/StaffSubsystem/AddService" element={<AddService/>}/>


        //ADMIN PAGES
        <Route path="/admin-dashboard/adminSubsystem/AdminServices" element={<AdminServices/>} />
        <Route  path="/admin-dashboard/adminSubsystem/AdminAppointment" element={<AdminAppointment/>}/>
        <Route path="/admin-dashboard/adminSubsystem/AdminClients" element={<AdminClients/>}/>
        <Route path="/admin-dashboard/adminSubsystem/AdminStaff" element={<AdminStaff/>} />
        <Route path="/admin-dashboard/adminSubsystem/AdminSettings" element={<AdminSettings/>}/>


        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to landing page */}

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


