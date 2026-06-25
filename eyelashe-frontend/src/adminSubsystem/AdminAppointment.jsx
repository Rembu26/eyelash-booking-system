import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import './Admin.css';


export default function AdminAppointment(){

const [appointments,setAppointments] = useState([])
const [loading,setLoading] = useState(true)


//filters
const [status,setStatus] = useState('pending') //tabs
const [date,setDate] = useState('')
const [customer,setCustomer] = useState('')
const [staffId,setStaffId] = useState('')


const navigate = useNavigate()

const fetchAppointments = async() =>{
    const token =
    localStorage.getItem('token')
    if(!token){
        navigate('/login')
        return
    }
    setLoading(true)

    try{
        const params = new 
        URLSearchParams()

        if(status) 
            params.append('status',status)
        if(date) 
            params.append('date',date)
        if(customer)
            params.append('customer',customer)
        if(staffId)
            params.append('staffId',staffId)

        const res = await fetch(`http://localhost:3000/api/appointments/admin?${params}`,{
            headers:{Authorization: `Bearer ${token}`}
        })

        if (res.status === 401){
            localStorage.removeItem('token')
            navigate('/login')
            return
        }

        const data = await res.json()

        setAppointments(Array.isArray(data) ?
    data : data.appointments || [])
    } catch(err){
        toast.error('Failed to load appointments')
        setAppointments([])
    } finally{
        setLoading(false)
    }
}

useEffect(() =>{
    fetchAppointments()
},[status,date,customer,staffId])


return(

    <div className="admin-appointment-page">
        <div className="admin-appointment-card">
            <div className="admin-appointment-header">
                <h2>Manage Appointments</h2>
            </div>
            <div className="appoint-btns">

                <button
                        className="btn-admin-appoint-back"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                <button className="admin-add-btn">
                        ➕ New Booking
                </button>

            </div>

            {/* Filetrs Row */}
            <div className="admin-appoint-filters">
                <input
                type="date" 
                value={date}
                onChange={(e)=>setDate(e.target.value)}
                className="admin-appoint-input"
                />

                <input
                type="text"
                placeholder="Search customer....."
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                 className="admin-appoint-input"
                />
                <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                 className="admin-appoint-input"
                >
                    <option value="">All Staff</option>
                    {/*TODO: map staff list here */}
                </select>

            </div>

            {/*Status Tabs */}
            <div className="admin-appoint-tabs">
                {['pending','confirmed','completed','cancelled'].map(s => (
                    <button
                    key={s}
                    onClick={()=>
                        setStatus(s)}
                        className={status === s ? 
                            'admin-appoint-tab admin-appoint-tab-active': 'admin-appoint-tab'
                        }
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}

                    </button>
                ))}

            </div>

            {/*TABLE */}
            <div className="admin-appoint-table-wrapper">
                {loading ? (
                    <p>Loading...</p>
                ) : appointments.length === 0 ? (
                    <p>No appointments found</p>
                ) : (
                    <table className="admin-appoint-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                 <th>Customer</th>
                                  <th>Service</th>
                                   <th>Staff</th>
                                    <th>Price</th>
                                     <th>Status</th>
                                      <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(a=> (
                                <tr key ={a._id}>
                                    <td>{new Date(a.date).toLocaleString()}</td>
                                    <td>{a.customer?.FirstName} {a.customer?.LastName}</td>
                                    <td>{a.service?.name}</td>
                                    <td>{a.staff?.FirstName || 'Unassigned'}</td>
                                    <td>R{a.service?.price}</td>
                                    <td><span className={`status.badge status-${a.status}`}>{a.status}</span></td>
                                    <td>
                                        <button className="admin-appoint-btn-small">Edit</button>
                                        <button className="admin-appoint-btn-small admin-appoint-btn-danger">Cancel</button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}

            </div>

        </div>

    </div>













)






}