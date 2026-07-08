import { useState,useEffect } from "react";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Admin.css';



export default function AdminClients(){


    const navigate = useNavigate();
    const [search,setSearch] = useState('');
    const [showModal,setShowModal] = useState(false);
    const [loading,setLoading] = useState(false);
    const [clients,setClients] = useState([]);

    const [tab,setTab] = useState('all') // all, pending,active,inactive

    const [form,setForm] = 
    useState({
      FirstName:'',
      LastName:'',
      PhoneNumber:'',
      email:'',
      role:'walk-in'
    });

   
  const [editClient,setEditClient] = useState(null);
  const [deactivateClient,setDeactivateClient] = useState(null);

  const [upgradeMode,setUpgradeMode] = useState(null);
  const [selectedClient,setSelectedClient] = useState(null)
  const [upgradeForm,setUpgradeForm] = useState({email:'',password:''});

  const openUpgradeModal = (client) =>{
    setSelectedClient(client);
    setUpgradeMode(true);
    setShowModal(true);
  }


  // Fetch real clients from backend
   
        const fetchClients = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/api/persons/clients', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                
                // map backend fields to match your table
                const formatted = res.data.map(c => ({
                    id: c._id,
                    name: `${c.FirstName} ${c.LastName}`,
                    phone: c.PhoneNumber,
                    email: c.email,
                    role: c.role,
                    status: c.status 
                }));
                setClients(formatted);
            } catch (err) {
                toast.error('Failed to load clients');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        useEffect(() =>{
          fetchClients();
        },[]);

        const handleToggleStatus = async(id) =>{

          try{
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:3000/api/persons/${id}/toggle-status`,{},
              {headers:{Authorization: `Bearer ${token}`}}
            );
            // Refresh to update the table immediately
            fetchClients();
          }catch(err){
            console.error('Error toggling status:',err);
            toast.error('Failed to update client status');
          }
        };
        if(loading)
          return <p>Loading clients...</p>

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
  // split name back to first/last for the form
  const [firstName, ...lastParts] = client.name.split(' ');
  setForm({
    FirstName: firstName, 
    LastName: lastParts.join(' '),
    phone: client.phone,
    email: client.email,
    role: client.role // <-- this is the important one
  })
  setShowModal(true)
}
const handleSaveClient = async (e) => {
  e.preventDefault();
  setLoading(true);
  const token = localStorage.getItem('token');
  try {
    if(upgradeMode) {
      // CASE 3: UPGRADE WALK-IN
      await axios.patch(
        `http://localhost:3000/api/persons/${selectedClient.id}/upgrade`,
        upgradeForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Client upgraded successfully');
    } 
    else if(editClient) {

      // CASE 2: EDIT
  const payload = {
    FirstName: form.FirstName,
    LastName:form.LastName,
    PhoneNumber: form.phone.replace(/\s/g, ''), // remove spaces
    email: form.email,
    role: form.role
  }
      await axios.put(`/api/persons/${editClient.id}`, form, { headers: { Authorization: `Bearer ${token}` } });
    } 
    else {
      // FIX 2: Full URL + correct payload
        const payload = {
          FirstName: form.FirstName,
          LastName: form.LastName,
          PhoneNumber: form.PhoneNumber.replace(/\s/g, '')
        }
        await axios.post(`http://localhost:3000/api/auth/admin/create-walk-in`, payload, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        toast.success('Walk-in created');
    }
    
    // reset everything
    setShowModal(false);
    setEditClient(null);
    setUpgradeMode(false);
    setForm({FirstName: '',LastName:'', PhoneNumber: '', email: '', role: 'walk-in'});
    setUpgradeForm({email: '', password: ''});
    fetchClients();
  } catch (err) {
    alert(err.response?.data?.error || 'Save failed');
  } finally {
    setLoading(false);
  }
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

  

  const filteredClients = clients.filter (c => (tab === 'all' || c.status == tab)
  && // <-- NET tab Filter
  (c.name.toLowerCase().includes(search.toLowerCase()) ||
   c.email && c.email.toLocaleLowerCase(). includes(search.toLocaleLowerCase()))

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
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ):filteredClients.length === 0 ?(
                <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No clients found</td></tr>
              ):(
                filteredClients.map(c=>
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
                                {c.role === 'walk-in' && (
                                  <button className="btn-upgrade"
                                  onClick={() => openUpgradeModal(c)}>
                                    upgrade
                                  </button>
                                )}
                               </td>
                        </tr>
                    )
                )
              )}
                
            </tbody>
        </table>

      </div>
    </div>

       {/* MODAL */}
      {/* MODAL: Add + Edit */}
{showModal && (
  <div className="modal-overlay" onClick={() => {setShowModal(false); setEditClient(null);setUpgradeMode(false)}}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <h3>
        {upgradeMode ? `Upgrade ${selectedClient?.name}`: editClient ? 'Edit Client' : 'Add New Client'}
        </h3>
      <form onSubmit={handleSaveClient}>
        {upgradeMode ? (
          <>
           <p style={{fontSize: '13px', color: '#6b7280', marginBottom: '16px'}}>
              Set login credentials for this walk-in
            </p>
            <label>Email</label>
            <input 
              required 
              type="email" 
              value={upgradeForm.email} 
              onChange={(e) => setUpgradeForm({...upgradeForm, email: e.target.value})} 
            />

            <label>Password</label>
            <input 
              required 
              type="password" 
              placeholder="Min 8 characters"
              value={upgradeForm.password} 
              onChange={(e) => setUpgradeForm({...upgradeForm, password: e.target.value})} 
            />
          </>
        ):(
          // ADD/EDIT MODE 
        <>
       <label>First Name</label>
<input required value={form.FirstName} onChange={(e) => setForm({...form, FirstName: e.target.value})} />

<label>Last Name</label>
<input required value={form.LastName} onChange={(e) => setForm({...form, LastName: e.target.value})} />

<label>Phone</label>
<input required placeholder="071 555 1234" value={form.PhoneNumber}
       onChange={(e) => setForm({...form, PhoneNumber: formatPhone(e.target.value)})} maxLength={12}/>

        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />

          {editClient && (
            <>
            
        <label>Role</label>
        <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
          <option value="walk-in">Walk-In</option>
          <option value="customer">Customer</option>
        </select>
            </>
          )}
        </>
        )}
       

        

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={() => {setShowModal(false); setEditClient(null);setUpgradeMode(false)}}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...':'Save'}
          </button>
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

