import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { Timeline } from "../components/Timeline";
import{
    LayoutDashboard,
    Calendar,
    Users,
    Sparkles,
    UserCog,
    Settings,
    LogOut,
    Plus,
    ShoppingBag,
    Send,
    CheckCircle,
    Clock,
    User
    

} from 'lucide-react';
import '../styles.css'; 

const AdminDashboard = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    //Mock data for timeline - in real app, this would come from API
    const timelineEvents = [
        { id: 1, time: '10:00 AM', event: 'New appointment booked by Sarah' ,status:"upcoming"},
        { id: 2, time: '11:30 AM', event: 'Appointment with Emily completed', status:"completed" },
        { id: 3, time: '1:00 PM', event: 'Staff meeting' ,status:"upcoming" },
        { id: 4, time: '3:00 PM', event: 'Inventory updated for lash extensions', status:"completed" },
    ];

    return (
       console.log("Rendering AdminDashboard with user:", user), // ← This will show us the user data on each render
        <div className="admin-layout">
            {/* TOP HEADER */}
            <header className="top-header">
                <div className="header-left">
                    <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}> ☰
                    </button>
                </div>
                <div className="header-center">
                    <img 
                        src="/images/logo.jpg"
                        alt="LashBliss Logo"
                        className="logo-img"
                    />
                    <h2>Lash Bliss </h2>
                    <Sparkles size={22} color="#ec4899"/>
                </div>
                <div className="header-right">
                    <div className="profile-info">
                        <User size={24} className="profile-icon"/>
                        </div>
                </div>

               
            </header>

            <div className="dashboard-layout">

             {/* 1.SIDEBAR - was Sidebar.jsx */}
             <aside className= {`sidebar ${sidebarOpen ? 'open':'collapsed'}`}>
            
            <nav className="sidebar-nav">

            <a href="#" className="sidebar-link active">
                <LayoutDashboard size={20}  />
                <span>Dashboard</span>
            </a>

            <a href="#" className="sidebar-link">
                <Calendar size={20} />
                <span>Appointments</span>
            </a>
            
            <a href="#" className="sidebar-link">
                <Users size={20} />
                <span>Clients</span>
            </a>

            <a href="#" className="sidebar-link">
                <Sparkles size={20} />
                <span>Services</span>
            </a>

            <a href="#" className="sidebar-link">
                <UserCog size={20} />
                <span>Staff</span>
            </a>

            <a href="#" className="sidebar-link">
                <Settings size={20} />
                <span>Settings</span>
            </a>
            <button onClick={handleLogout} className="logout-btn">
                <LogOut size={20} />
                <span>Logout</span>
            </button>

        </nav>
        
      </aside>

            <main className="main-content">
                <h2 className="top-header">Welcome, {user ?.name || "Admin"}!</h2>
                <p>Here's what's happening today:</p>
            </main>

            </div>

           

        {/* 2. MAIN CONTENT AREA*/}
       

        {/* 3. ACTION CENTER - was ActionCenter.jsx */}
        <section className="dashboard-section action-center">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
                <button className="action-btn primary">
                    <Plus size={18} /> Add Client00
                </button>
                <button className="action-btn">
                    <Calendar size={18} /> Block Time
                </button>
                <button className="action-btn">
                <ShoppingBag size={18} /> Add Retail
                </button>
                <button className="action-btn">
                    <Send size={18} /> SMS All
                </button>
            </div>
        </section>

            {/* Stats Card */}
            <section className="dashboard-card stats">
                <h3>Today's Stats</h3>
                <div className="stat-item">
                    <span className="stat-label">Revenue</span>
                    <span className="stat-value">R2,450</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Bookings</span>
                    <span className="stat-value">12</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Active Staff</span>
                    <span className="stat-value">5</span>
                </div>
            </section>

            {/* Timeline Card */}
                <section className="dashboard-card timeline">
                    <h3>Today's Timeline</h3>
                    <div className="timeline-list">
                        {timelineEvents.map(event => (
                            <div key={event.id} className={`timeline-item ${event.status}`}>
                                <div className="timeline-icon">
                                    {event.status === "completed" ? <CheckCircle size={16} /> : <Clock size={16} />}
                                </div>
                                <div className="timeline-content">
                                    <span className="timeline-time">{event.time}</span>
                                    <span className="timeline-action">{event.action}</span>
                                </div>
                            </div>
                        ))}
                    </div>
            </section>
        </div>

    );
};
               
export default AdminDashboard;