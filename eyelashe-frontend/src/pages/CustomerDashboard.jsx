import  React,{useState,useEffect} from "react";
import {User,Sparkles,PlusCircle,BookCheck,WalletCards,Home,LogOut,
    Clock,AlertTriangle,Plus,ChevronDown} from 'lucide-react';
import { useNavigate } from "react-router-dom";


const CustomerDashboard = () => {
     const userStr = localStorage.getItem("user");
    const user = userStr? JSON.parse(userStr) : null;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [pastOpen,setPastOpen] = useState(false);

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
        <div className={`customer-dashboard-page ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
            <div className="customer-layout">
                <header className="customer-header">
                    <div className="header-left">
                        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
                    </div>
                    <div className="header-center">
                        <img src="/images/logo.jpg" alt="LashBliss Logo" className="logo-img" />
                        <h2>Lash Bliss</h2>
                        <Sparkles size={22} color="#ffff"/>
                    </div>
                    <div className="header-right">
                        <div className="profile-info">
                            <User size={24} className="profile-icon"/>
                        </div>
                    </div>
                </header>

                <aside className={`customer-sidebar ${sidebarOpen? 'open' : 'collapsed'}`}>
                    <a href="#" className="customer-nav-link active">
                        <Home/>
                        <span>Home</span>
                    </a>
                    <a href="#" className="customer-nav-link">
                        <PlusCircle/>
                         <span>Book Now</span>
                    </a>
                    <a href="#" className="customer-nav-link">
                        < BookCheck/>
                         <span>My Bookings</span>
                    </a>
                    <a href="#" className="customer-nav-link">
                        <WalletCards size={20}/>
                         <span>Payments</span>
                    </a>
                    <a href="#" className="customer-nav-link">
                        < User size={20}/>
                        <span>Profile</span>
                    </a>
                     <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </aside>

                <main className="customer-main">
                    <div className="welcome-box">
                    <h2>Hi 💝, {user.FirstName}!</h2>
                    <p>Here's what's happening today:</p>
                    </div>


                    <div className="stats-grid">

                        <div className="stat-card">
                        <h3><Clock/>Next Appointment</h3>
                        <p>Oct 28, 2pm<br/>Classic Set</p>
                        </div>

                        <div className="stat-card">
                        <h3><AlertTriangle/>Pending Payments
                        </h3>
                        <p>R120</p>
                        </div>
                        <div className="stat-card">
                        <h3>Total Visits</h3>
                        <p>8</p>
                        </div>

                    </div>


                    <button className="btn-add"><Plus/>Add
                    New Appointment</button>

                    <div className="past-bookings">
  {/* Header always visible */}
  <div 
    className="past-bookings-header" 
    onClick={() => setPastOpen(!pastOpen)}
  >
    Past Bookings {pastOpen ? '▲' : '▼'}
  </div>

  {/* Only this part collapses */}
  <div className={`past-bookings-content ${pastOpen ? 'open' : ''}`}>
      <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Service</th>
                                <th>Stylist</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Oct 28<br/>2:00 pm</td>
                                <td>Volume Lashes</td>
                                <td>Lethu</td>
                                <td className="badge confirmed">
                                    <span style={{marginRight : '60px',
                                        display : 'inline-block'
                                    }}>Confirmed</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-cancel">Cancel</button>
                                        <button className="btn-reschedule">Reschedule</button>
                                    </div>
                                    
                                </td>
                            </tr>
                        </tbody>

                    </table>
  </div>
</div>





                </main>





                
                <footer className="customer-footer">
                     <p>&copy; 2026 Lash Bliss. All rights reserved.</p>    
                </footer>

            </div>
        </div>
    );
};

export default CustomerDashboard;