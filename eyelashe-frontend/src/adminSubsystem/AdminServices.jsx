import { useState,useEffect } from "react";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import './Admin.css';


export default function AdminServices () {
    const [tab,setTab]=useState('pending');
    const [services,setServices] = useState([]);
    
    const navigate = useNavigate()

    
    const fetchServices = async () =>{
  const token = localStorage.getItem('token')

  if(!token){
    setServices([])
    navigate('/login') // auto redirect if no token
    return // STOP here, don’t fetch
  }

  let filter = {}
  if(tab === 'pending') filter = {approved: false}
  if(tab === 'active') filter = {approved: true, active: true}
  if(tab === 'inactive') filter = {active: false}

  try {
    const res = await fetch(`http://localhost:3000/api/services/admin?filter=${encodeURIComponent(JSON.stringify(filter))}`,{
      headers:{Authorization: `Bearer ${token}`}
    })

    if(res.status === 401) {
      localStorage.removeItem('token')
      navigate('/login') // kick to login on expired token
      return
    }

    if(!res.ok) {
      setServices([])
      return
    }

    const data = await res.json()
    setServices(Array.isArray(data)? data : (data && data.services) ? data.services : [])
  } catch(err) {
    setServices([])
  }
}
    
    
    
    
    const approve = async (id) =>{
      const token =
    localStorage.getItem('token');

    if(!token)
      return


        await fetch (`http://localhost:3000/api/services/${id}/approve`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({stylistIds:[]})
        })
         console.log('Token being sent',token)
        toast.success('Service approved!')
        fetchServices()
    }
    const deactivate = async(id) =>{
      const token =
    localStorage.getItem('token');

    if(!token)
      return
      
        await fetch(`http://localhost:3000/api/services/${id}/deactivate`,{
            method: 'PATCH',
            headers :{Authorization: `Bearer ${token}`}
        })
         console.log('Token being sent',token)
        toast.error('Services deactivated')
        fetchServices()
    }
    const activate = async(id) =>{
      const token =
    localStorage.getItem('token');

    if(!token)
      return
        await fetch(`http://localhost:3000/api/services/${id}/activate`,{
            method: 'PATCH',
            headers :{Authorization: `Bearer ${token}`}
        })
        console.log('Token being sent',token)
        toast.success('Services reactivated!')
        fetchServices()
    }

    useEffect(() =>{fetchServices()},
    [tab]
)
   

return(
  <div className="admin-service-page">
    <div className="admin-service-card">
      <div className="admin-service-header">
        <h2>Manage Services</h2>
      </div>
      
      <div className="admin-service-actions">
        <button className="admin-btn-back" onClick={() => navigate(-1)}>← Back</button>
         
        
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button onClick={() => setTab('pending')} className={tab === 'pending'? 'admin-tab admin-tab-active' : 'admin-tab'}>Pending</button>
        <button onClick={() => setTab('active')} className={tab === 'active'? 'admin-tab admin-tab-active' : 'admin-tab'}>Active</button>
        <button onClick={() => setTab('inactive')} className={tab === 'inactive'? 'admin-tab admin-tab-active' : 'admin-tab'}>Inactive</button>
      </div>

      {/* Service list */}
      <div className="admin-service-list">
        {services.length === 0? (
          <p>No services in this tab</p>
        ) : (
          services.map(s => (
            <div key={s._id} className="admin-service-item">
  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
    <span className="label">Service</span>
    <span className="date">{new Date(s.createdAt).toLocaleDateString()}</span>
  </div>
  
  <h3>{s.name} - R{s.price}</h3>
  
  <p>Duration: {s.duration} mins</p>
  <p>
    By: {s.createdBy? `${s.createdBy.FirstName} ${s.createdBy.LastName}` : 'Unknown'}
  </p>

  <div className="admin-card-actions">
    {tab === 'pending' && (
      <>
        <button className="admin-btn-approve" onClick={() => approve(s._id)}>Approve</button>
        <button className="admin-btn-deactivate" onClick={() => deactivate(s._id)}>Deactivate</button>  
      </>
    )}
  </div>
</div>
            
          ))
        )}
      </div>
    </div>
  </div>
)

}