import React, { useState, useEffect } from "react";
import { User, Sparkles,LogOut,WalletCards,MessageCircle,Calendar1Icon,UserPlus,Home,Eye
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import NextUpCard from './NextUpCard';
import AppointmentList from './AppointmentList'
import Notes from './Notes'
import { Link } from "react-router-dom";

const StaffDashboard = () => {
    const userStr = localStorage.getItem("user");
    const user = userStr? JSON.parse(userStr) : null;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate()

    const mockUpBookings =[
        {id:1, client: "Sarah Miller",time:"2026-05-27T14:30:00",service:'Volume Lashes',
            duration:"2h",lashTech:"Ava"
        },
        {id:2, client: "Emily Doe",time:"2026-05-27T16:00:00",service:'Classic Fill',
        duration:"1h",lashTech:"Violet"},
        {id:3, client: "Emma Wilson",time:"2026-05-27T17:15:00",service:'Mega Volume',
        duration:"2.5h",lashTech:"Ava"},
    ];

    const mockApp = [
        {id: 1, time:'10:00 AM',customerId:'c1',client:'Sarah M',service:'Hybrid Refill',status:'confirmed',
            datetime:'2026-05-28T10:00:00Z'},
        {id:2, time: '11:30 AM',customerId:'c2',client:'Sasha Dlamini',service:'Volume Set',status:'completed',
            datetime:'2026-05-28T11:30:00Z'
        },
        {id:3,time : '15:00 PM',customerId:'c3', client:'Kim Doe', service:"Lash Removal",status:'cancelled',
            datetime:'2026-05-28T15:00:00Z'
        }
    ];
    const mockCustomerAppoint = [
        {
        id:'n1',
        customerId:'c1',
        text:'Sensitive eyes. Use low fume glue.'
        },
        {
        id:'n2',
        customerId:'c2',
        text:'Loves cat-eye, 12-15mm D curl.'
        },
        {
        id:'n3',
        customerId:'c3',
        text:'Allergic to tape. Use gel patches.'
        }
        
    ];
    const [appointments,setAppointments]=
    useState(mockApp)

   const handleCancel = (id) => {
  setAppointments(appointments.map(apt => 
    apt.id === id ? { ...apt, status: 'cancelled' } : apt
  ));
};
    const handleReschedule = (id) => {
        console.log('Reschedule',id)
    };

    const handleOpenBooking = (id)=>{
        console.log('Open booking:',id)
    }

const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    // Log user on mount/change
    useEffect(() => {
        console.log("Rendering StaffDashboard with user:", user);
    }, [user]);

    return (
        <div className={`staff-dashboard-page ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
            <div className="staff-layout">

                <header className="staff-header">
                    <div className="header-left">
                        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                    </div>
                    <div className="header-center">
                        <img src="/images/logo.jpg" alt="LashBliss Logo" className="logo-img" />
                        <h2>Lash Bliss</h2>
                        <Sparkles size={22} color="#F857A8"/>
                    </div>
                    <div className="header-right">
                        <div className="profile-info">
                            <User size={24} className="profile-icon"/>
                        </div>
                    </div>
                </header>

                <aside className={`staff-sidebar ${sidebarOpen? 'open' : 'collapsed'}`}>

                    <a href="#" className="staff-nav-link active">
                        <Home/>
                        <span>Home</span>
                    </a>

                    <a href="#" className="staff-nav-link">
                        <Calendar1Icon/>
                         <span>My Schedule</span>
                    </a>

                    <Link to="/staff-dashboard/StaffSubSystem/MyServices" className="staff-nav-link"> 
                    <Eye size={20}/>
                    <span>My Services</span>
                    </Link>

                    <a href="#" className="staff-nav-link">
                        < UserPlus/>
                         <span>Clients</span>
                    </a>
                    <a href="#" className="staff-nav-link">
                        <WalletCards size={20}/>
                         <span>Earnings</span>
                    </a>
                    <a href="#" className="staff-nav-link">
                        < MessageCircle size={20}/>
                        <span>Feedback</span>
                    </a>
                     <button onClick={handleLogout} className="logout-btn">
                                    <LogOut size={20} />
                                    <span>Logout</span>
                    </button>
                </aside>

                <main className="staff-main">
                    <div className="welcome-box">
                    <h2>Hi 💕, {user.FirstName}!</h2>
                    <p>Here's what's happening today:</p>
                    </div>
                    
                    <div className="staff-dashboard-grid">

                        {/*LEFT COLUMN */}
                        <div className="dashboard-col">
                        <NextUpCard
                        bookings ={mockUpBookings}
                        onOpenBooking={handleOpenBooking}
                        />

                        
                    <div className="staff-card">
                    <div className="card-header">
                    <h3 className="staff-card-title">Today's Stats</h3>
                    </div>
                    <div className="stats-content">
                    <div className="stat-item">
                        <span className="stat-number">8</span>
                        <span className="stat-label">Appointments</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">$1,240</span>
                        <span className="stat-label">Revenue</span>
                    </div>

                    <div className="stat-item">
                    <span className="stat-number">92%</span>
                    <span className="stat-label">Show Rate</span>
                    </div>
                    <div className="stat-item">
                    <span className="stat-number">4.9</span>
                    <span className="stat-label">Avg Rating</span>
                    </div>

                    </div>



                </div>
                 <Notes
                    appointments={mockApp}
                    customerNotes={mockCustomerAppoint}
                    />
                        
                </div>
                {/*RIGHT COLUMN */}

                <div className="dashboard-col">
                    <div className="staff-appointment-card">
                    <div className="card-header">
                        <h3 className="staff-card-title">Today's Appointments</h3>
                    </div>
                    
                    <div className="staff-appointment-scroll">
                        <AppointmentList
                        appointments={appointments}
                        onCancel={handleCancel}
                        onReschedule={handleReschedule}
                        />
                    </div>
                    </div>
                </div>
                    

                    
                    
                    

                    </div>
                   

                                    
                    


                </main>










                <footer className="staff-footer">
                     <p>&copy; 2026 Lash Bliss. All rights reserved.</p>    
                </footer>
            </div>
        </div>
    );
}

export default StaffDashboard;