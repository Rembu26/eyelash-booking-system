import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";

import{
    LayoutDashboard,
    Calendar as CalendarIcon,
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
    User,
    
    

} from 'lucide-react';
import '../styles.css'; 
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'
import {PieChart,Pie,Cell,ResponsiveContainer,Tooltip } from 'recharts'


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
     const [date,setDate]= useState(new Date());
    //Mock data for timeline - in real app, this would come from API
    const timelineEvents = [
        { id: 1, time: '10:00 AM', event: 'New appointment booked by Sarah' ,status:"upcoming",client: "Sarah"},
        { id: 2, time: '11:30 AM', event: 'Appointment with Emily completed', status:"completed",client: "Emily" },
        { id: 3, time: '1:00 PM', event: 'Staff meeting' ,status:"upcoming" },
        { id: 4, time: '3:00 PM', event: 'Inventory updated for lash extensions', status:"completed" },
    ];
    //mock data for appointments 
    const appointments = [
  { id: 1, status: "UPCOMING", time: "10:00 AM", service: "Lash Refill", client: "Sarah" },
  { id: 2, status: "UPCOMING", time: "11:30 AM", service: "Lash Removal", client: "Aisha" },
  { id: 3, status: "UPCOMING", time: "02:00 PM", service: "New Set of Lash", client: "Priya" },
  { id: 4, status: "UPCOMING", time: "04:00 PM", service: "Lash Tint", client: "Callie" },
];
  const notifications = [
    { id: 1, type: 'signup', text: 'New customer signup: Lindiwe' },
    { id: 2, type: 'availability', text: 'Sarah changed availability' },
    { id: 3, type: 'confirmed', text: 'Appointment confirmed for John' },
    { id: 4, type: 'error', text: 'Payment failed for Invoice #1024' },
  ];
const stats = [
  { label: 'Today’s Appointments', value: '12', change: '+2', trend: 'up' },
  { label: 'Revenue Today', value: '$1,240', change: '+8%', trend: 'up' },
  { label: 'New Clients', value: '5', change: '-1', trend: 'down' },
  { label: 'Completion Rate', value: '94%', change: '+3%', trend: 'up' },
];
  const statusData = [
    {name: 'Completed',value:18},
    {name:'Upcoming', value:7},
    {name:'Cancelled',value: 2},
    {name:'No-show',value:2}
  ];
  const COLORS = ['#2dd4bf','#f472b6','#f87171','#6b7280'];
 

    return (
       console.log("Rendering AdminDashboard with user:", user), // ← This will show us the user data on each render
       
       

             <div className="admin-layout dashboard-page">

        <div className={`dashboard-layout  ${sidebarOpen ? '' : 'sidebar-collapsed' }`}>
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

        {/* 1. SIDEBAR */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
            <nav className="sidebar-nav">

            <a href="#" className="sidebar-link active">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
            </a>

            <Link to="/admin-dashboard/adminSubSystem/AdminAppointment" className="sidebar-link">
            <CalendarIcon size={20} />
                <span>Appointments</span>
            </Link>
               
            <Link to="/admin-dashboard/adminSubSystem/AdminClients" className="sidebar-link" >
            <Users size={20} />
                <span>Clients</span>
            </Link>
            
            <Link to="/admin-dashboard/adminSubsystem/AdminServices"  className="sidebar-link">
            <Sparkles size={20} />
                <span>Services</span>
            </Link>

            <Link to="/admin-dashboard/adminSubsystem/AdminStaff" className="sidebar-link">
                <UserCog size={20} />
                <span>Staff</span>
            </Link>


            <Link to="/admin-dashboard/adminSubsystem/AdminSettings" className="sidebar-link">
                <Settings size={20} />
                <span>Settings</span>
            </Link>

            <button onClick={handleLogout} className="logout-btn">
                <LogOut size={20} />
                <span>Logout</span>
            </button>

            </nav>
        </aside>
        
        <main className="main-content">
          
  <div className="dashboard-grid">

       <div className="welcome-box">
       <h2>Hi💗, {user.FirstName}!</h2>
        <p>Here's what's happening today:</p>
    </div>

    {/* Left Column */}
    <div className="left-column">
      
      {/* Overview Card - 4 cells horizontally */}
      <section className="dashboard-card overview-card">
        <h3 className="card-title">Overview</h3>
        
        <div className="overview-grid">
          <div className="overview-cell">
            <p className="kpi-label">Bookings Today</p>
            <p className="kpi-value">12</p>
            <p className="kpi-change positive">+2 from yesterday</p>
          </div>

          <div className="overview-cell">
            <p className="kpi-label">Revenue This Week</p>
            <p className="kpi-value">R4,500</p>
            <p className="kpi-change positive">+12%</p>
          </div>

          <div className="overview-cell">
            <p className="kpi-label">Cancellations</p>
            <p className="kpi-value">2</p>
            <p className="kpi-change negative">-1 from yesterday</p>
          </div>

          <div className="overview-cell">
            <p className="kpi-label">Active Staff</p>
            <p className="kpi-value">5</p>
          </div>
        </div>
      </section>

      {/* Upcoming Appointments */}
      {/* Upcoming Appointments */}
<section className="dashboard-card">
  <h3 className="card-title">Upcoming Appointments</h3>

  {/* Filter tabs */}
  <div className="filter-tabs">
    <button className="tab active">Today</button>
    <button className="tab">This Week</button>
    <button className="tab">Next Week</button>
  </div>

  {/* Appointment list */}
  <div className="dashboard-card appointment-card">
<div className="appointment-list">
    {appointments.length > 0 ? (
      appointments.map((apt) => (
        <div key={apt.id} className="appointment-item">
          <div className="appointment-header">
            <span className={`appointment-label ${apt.status.toLowerCase()}`}>
              {apt.status}
            </span>
            <span className="appointment-time">{apt.time} Today</span>
          </div>
          <div className="appointment-title">
            {apt.service} with {apt.client}
          </div>
          <div className="appointment-actions">
            <button className="action-btn primary">Reschedule</button>
            <button className="action-btn">Cancel</button>
            <button className="action-btn">Assign</button>
          </div>
        </div>
      ))
    ) : (
      <p className="empty-state">No appointments for today</p>
    )}
  </div>
  </div>
  
</section>

      {/* Paired cards row 1 */}
      <div className="paired-row">
        
        
      <section className="dashboard-card stats-card">
  <h3 className="stats-title">Today's Breakdown</h3>
  
  <div className="stats-chart-wrap">
    
    {/* Chart */}
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={statusData}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={70}
          paddingAngle={4}
          dataKey="value"
          label={false}
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            background:'#2d2943',
            border:'none',
            borderRadius:'8px',
            color:'#fff'
          }}
        />
      </PieChart>
    </ResponsiveContainer>

    {/* Legend */}
    <div className="stats-legend">
      {statusData.map((item, index) => (
        <div className="legend-item" key={item.name}>
          <span className="legend-dot" style={{ background: COLORS[index] }}></span>
          <span className="legend-label">{item.name}</span>
          <span className="legend-value">{item.value}</span>
        </div>
      ))}
    </div>

  </div>
</section>



        {/* New Quick Stats card */}
  <section className="dashboard-card kpi-card">
    <h3 className="kpi-title">Quick Stats</h3>
    <div className="kpi-grid">
      {stats.map((stat, i) => (
        <div className="kpi-item" key={i}>
          <p className="kpi-label">{stat.label}</p>
          <div className="kpi-row">
            <span className="kpi-value">{stat.value}</span>
            <span className={`kpi-change ${stat.trend}`}>
              {stat.trend === 'up' ? '▲' : '▼'} {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>

      </div>
    </div>

    {/* Right Column - only notifications, scrollable */}
    {/* Right Column */}
<div className="right-column">
  
  {/* Notifications - top */}
  <section className="dashboard-card notifications-card">
  <h3 className="card-title">Notifications</h3>
  <div className="notif-list">
    {notifications.map(notif => (
      <div className="notif-item" key={notif.id}>
        <span className={`dot ${notif.type}`}></span>
        <span>{notif.text}</span>
      </div>
    ))}
  </div>
</section>

  {/* Calendar - underneath notifications */}
  <section className="dashboard-card calendar-card">
    <h3 className="card-title">Calendar</h3>
    <Calendar 
      onChange={setDate} 
      value={date} 
      className="dashboard-calendar"
    />
  </section>
  <section className="dashboard-card timeline-card">
  <h3 className="timeline-title">Today's Timeline</h3>
  <div className="timeline-content">
    {timelineEvents.map(item => (
      <div className={`timeline-item ${item.status}`} key={item.id}>
        <div className="timeline-line"></div>
        <span className={`timeline-dot ${item.status}`}></span>
        
        <div className="timeline-body">
          <div className="timeline-header">
            <span className="timeline-icon">
              {item.status === 'completed' ? '✓' : '🕒'}
            </span>
            <span className="timeline-time">{item.time}</span>
            <span className={`timeline-badge ${item.status}`}>
              {item.status.toUpperCase()}
            </span>
          </div>
          <div className="timeline-event">{item.event}</div>
        </div>
      </div>
    ))}
  </div>
</section>

</div>

  </div>
</main>
      

<footer className="dashboard-footer">
  <p>&copy; 2026 Lash Bliss. All rights reserved.</p>     
</footer> 

<aside className="right-sidebar">
  {/* To come later*/}
</aside>



           

    
    
    </div>

   

    </div>
          




    );
};
               
export default AdminDashboard;