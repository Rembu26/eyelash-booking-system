import React from "react";
import { useState } from "react";
import {toast} from "react-toastify";

function Login(){
    const navigate = useNavigate();
    const[email,setEmail] =useState("");
    const[password,setPassword] =useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch("http://localhost:3000/api/auth/login",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    email,
                    password,
                }),
            });

            console.log("Raw response:", response);

            const data = await response.json();

            console.log("Parsed data:", data);

            if(response.ok){
                toast.success("Login successful 💅!");
               
                localStorage.setItem("token", data.token); // Store token for future use    
                navigate("/dashboard"); // Redirect to dashboard after successful login

                fetch("http://localhost:3000/api/protected", {
                    headers: {
                        Authorization: `Bearer ${data.token}`
                    }
            });

            } else {
                toast.error("Login failed💔: " + data.message);
            }
        }
        catch(error){
            console.error("Error during login:", error);
            alert("An error occurred. Please try again later.");
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