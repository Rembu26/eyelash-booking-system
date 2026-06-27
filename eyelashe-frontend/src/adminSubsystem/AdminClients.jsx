import { useState,useEffect } from "react";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import './Admin.css';


export default function AdminClients(){


    const navigate = useNavigate()
    const [search,setSearch] = useState('')
    const [showModal,setShowModal] = useState(false)
    const [clients,setClients] = 
    useState([
         {id:1,name:'Aisha Khan',phone:'0715551234',role:'customer',status:'pending',email:'aisha@gmail.com'},
         {id:2,name:'Sandra Smith', phone:'0851526325',role:'walk-in',status:'active',email:'sandra@gmail.com'},
         {id:3,name:'Monica Doe',phone:'0785652201',role:'walk-in',status:'inactive',email:'monica@gmail.com'}
    ])

    const [form,setForm] = 
    useState({name:'',phone:'',email:'',role:'walk-in'})

   
  const [editClient,setEditClient] = useState(null)
    const [deactivateClient,setDeactivateClient] = useState(null);

    const formatPhone = (value) =>{
        //1.strip everything except digits
        const digits = value.replace(/\D/g,'').slice(0,10) //SA numbers = 10 digits

        //2.Add Spaces: xxx xxxx
        if(digits.length <=3) return digits
        if(digits.length <=6) return `${digits.slice(0,3)} ${digits.slice(3)}`
        return `${digits.slice(0,3)} ${digits.slice(3,6)} ${digits.slice(6)}`
    }
const openEdit = (client) =>{
  setEditClient(client)
  setForm({...client})
  setShowModal(true)
}

const handleSaveClient = (e) => {
  e.preventDefault()
  if(editClient){
    //Edit : repkace client
    setClients(clients.map(c => c.id ===
      editClient.id ? {...form, id: c.id,
        status:c.status}:c))
        toast.success('Client updated')
  }
  else{
    //Add new client 
    const newClient = {id:
      Date.now(),...form,status:'pending'}
      setClients([newClient,...clients])
      toast.success('Client added')
  }
  setForm({name:'',phone:'',email:'',role:'walk-in'})
  setEditClient(null)
  setShowModal(false)
}
  const confirmDeactivate = (client) =>{
    setDeactivateClient(client)
  }

  const handleDeactivate = () => {
    setClients(clients.map(c => 
      c.id === deactivateClient.id ?
      {...c,status: c.status === 'active' ? 'inactive':'active'} :c
    ))
    toast.success(deactivateClient.status === 'active' ? 'Client deactivated':'Clirent activated')
    setDeactivateClient(null)
  }

  const [tab,setTab] = useState('all') // all, pending,active,inactive

  const filteredClients = clients.filter (c => (tab === 'all' || c.status == tab)
  && // <-- NET tab Filter
  (c.name.toLowerCase().includes(search.toLowerCase()) ||
   c.email.toLocaleLowerCase(). includes(search.toLocaleLowerCase()))

  )

return(
  <div className="admin-client-page">
    <div className="admin-client-card">
      <div className="admin-client-header">
        <h2>Manage Clients</h2>
      </div>
      
      <div className="admin-client-toolbar">
        <button className="admin-btn-back" onClick={() => navigate(-1)}>← Back</button>
         <input
        type="text"
        placeholder="Search by name,email....."
        className="admin-search"
        value={search}
        onChange={(e)=> setSearch(e.target.value)}
        />
        <button className="admin-btn-add" onClick={()=> setShowModal(true)}>➕ Add Client</button>
      </div>

      {/*TABS*/}
      <div className="admin-client-tabs" style={{display:'flex', gap:'8px', margin:'12px 0'}}>
  {['all','pending','active','inactive'].map(t => (
    <button 
      key={t}
      className={`tab-btn ${tab === t ? 'active' : ''}`}
      onClick={() => setTab(t)}
      style={{
        padding:'6px 12px', borderRadius:'8px', border:'1px solid #e5e7eb',
        background: tab===t ? '#111827' : '#fff', color: tab===t ? '#fff' : '#111827',
        textTransform:'capitalize', cursor:'pointer'
      }}
    >
      {t} {tab===t && `(${clients.filter(c => t==='all' || c.status===t).length})`} 
    </button>
  ))}
</div>

      <div className="admin-client-body">

        {/*TABLE */}
       
        <table className="admin-client-table">
            <thead>
               <tr>
                <th>Name</th>
                 <th>Phone</th>
                 <th>Email Address</th>
                  <th>Role</th>
                  <th>Status</th>
                   <th>Actions</th>
               </tr>

            </thead>
            <tbody>
                {filteredClients.map(c=>
                    (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                             <td>{formatPhone(c.phone)}</td>
                              <td>{c.email}</td>
                               <td><span className={`badge badge-${c.role}`}>{c.role}</span></td>
                               <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                               <td>
                                <button className="btn-edit" onClick={() => openEdit(c)}>Edit</button>
                                <button className="btn-delete" onClick={()=> confirmDeactivate(c)}>{c.status === 'active' ? 'Dectivate':'Activate'}</button>
                               </td>
                        </tr>
                    )
                )}
            </tbody>
        </table>

      </div>
    </div>

       {/* MODAL */}
      {/* MODAL: Add + Edit */}
{showModal && (
  <div className="modal-overlay" onClick={() => {setShowModal(false); setEditClient(null)}}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>{editClient ? 'Edit Client' : 'Add New Client'}</h3>
      <form onSubmit={handleSaveClient}>
        <label>Name</label>
        <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />

        <label>Phone</label>
        <input required placeholder="071 555 1234" value={form.phone} 
               onChange={(e) => setForm({...form, phone: formatPhone(e.target.value)})} maxLength={12}/>

        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />

        <label>Role</label>
        <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
          <option value="walk-in">Walk-In</option>
          <option value="customer">Customer</option>
        </select>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => {setShowModal(false); setEditClient(null)}}>Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </div>
  </div>
)}

{/* CONFIRM MODAL: Deactivate/Activate */}
{deactivateClient && (
  <div className="modal-overlay" onClick={() => setDeactivateClient(null)}>
    <div className="modal" style={{maxWidth: '360px'}} onClick={(e) => e.stopPropagation()}>
      <h3>{deactivateClient.status === 'active' ? 'Deactivate' : 'Activate'} Client?</h3>
      <p style={{margin: '12px 0', color: '#4b5563'}}>
        Are you sure you want to {deactivateClient.status === 'active' ? 'deactivate' : 'activate'} {deactivateClient.name}?
      </p>
      <div className="modal-actions">
        <button className="btn-cancel" onClick={() => setDeactivateClient(null)}>Cancel</button>
        <button className="btn-delete" onClick={handleDeactivate}>
          {deactivateClient.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    
    )
}

