import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";

export default function Splash ()  {
    const navigate = useNavigate();
    
    

    useEffect(() => {

        
        const timer = setTimeout (() => {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.role) { // Check if user data and role exist
                navigate('/login'); // Redirect to login if no user data
                return;
            }
            const role = user?.role; // Safely access role
            if (role === "admin") {
                navigate('/admin-dashboard');
            } else if (role === "customer") {
                navigate('/customer-dashboard');
            } 
            else {
                navigate('/login'); // Redirect to login if role is unrecognized
            }

        }, 3000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [navigate]);
    console.log("Splash page loaded")

    return  (
       
         <div className="splash">
            <img src="/images/Splash.jpg" alt="Welcome to LashFash" className="splash-logo" />
            <p className="splash-tagline">Loading...</p>
        </div>

       

    );
};



