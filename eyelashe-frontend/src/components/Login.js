import React from "react";
import { useState } from "react";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";


function Login(){
    const navigate = useNavigate();
    const[email,setEmail] =useState("");
    const[password,setPassword] =useState("");
    const[error,setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
      
        try {
          const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
      
          const data = await response.json();
          console.log("Login response:", data); // ← This will show us what backend sends
      
          if (response.ok) {
            toast.success("Login successful 💅!");
            
            // Save user data with role
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            navigate("/splash"); // Show splash screen first
      
          }else{
            setError(data.message || "Invalid email or password.");
            toast.error(data.message || "Login failed. Please check your credentials and try again.");
          }
        } 
        
        catch (err) {
          setError("Something went wrong. Please try again.");
        }
      };

    return(
       
 <div className="login-container">
                
           
            <button className="back-button" onClick={() => window.location.href = '/'}>← Back</button>


            <h1>Hey Beauties, Welcome to our System</h1>

            <div className="login-card">
                <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="Email Address" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />

                    <input type="password"
                     placeholder="Password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     />

                    <button>Login</button>

                </form>
                
                

               <p>New user? <a href="/register">Register your account</a></p>
            </div>
            </div>
       
            
           
        
    );
}
export default Login;