import React from "react";

const StaffDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <div style={{padding: '40px'}}>
            <h1>Welcome back, {user?.name || 'staff'}  💇‍♀️</h1>
            <p>Staff dashboard coming soon.</p>   
            <button onClick={() =>{
                localStorage.clear(); // Clear all local storage data
                window.location.href = '/login'; // Redirect to login page
            }}>Logout</button>
        </div>
    );
};

export default StaffDashboard;