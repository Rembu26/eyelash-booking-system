import React from 'react';
import '../styles.css';
import LashGallery from './LashGallery';
import { useNavigate } from 'react-router-dom';


function LandingPage(){

  const navigate = useNavigate();


    return(
          <div className="page">
             <div className="header">
                <h1>Lash Beauty System</h1>
                </div>


            <div className="main-section">
            
                <h2>Enhance Your Beauty</h2>
               <p>Book your lash appointments and get lash'd</p>



            

             <div className="buttons">
                <button className="login-btn" onClick={() => navigate('/login') }>
                  Login</button>
                <button className="secondary" onClick={()=> navigate('/register')}
                >Get Started</button>

              </div>

             
                <LashGallery/>
            </div>

            <div className="footer">
        <p>© 2026 Lash Beauty System</p>
      </div>

        </div>


        

        
    )
}
export default LandingPage;