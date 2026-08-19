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
    const [tab,setTab] = useState('all') // all, pending, active, deactive  <-- FIX 1

    const [form,setForm] = useState({
      FirstName:'',
      LastName:'',
      PhoneNumber:'',
      email:'',
      role:'walk-in'
    });

    const [editClient,setEditClient] = useState(null);
    const [deactivateClient,setDeactivateClient] = useState(null);
    const [showDeactivateModal,setShowDeactivateModal] = useState(false); // FIX: was null
    const [upgradeMode,setUpgradeMode] = useState(false);
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

            // FIX 2: Add phoneBlocked check
            const allClients = res.data;
            const customerPhones = new Set(
              allClients
                .filter(c => c.role === 'customer' && c.status === 'active')
                .map(c => c.PhoneNumber)
            );

            const formatted = allClients.map(c => ({
                id: c._id,
                name: `${c.FirstName} ${c.LastName}`,
                phone: c.PhoneNumber,
                email: c.email,
                role: c.role,
                status: c.status,
                phoneBlocked: c.role === 'walk-in' && customerPhones.has(c.PhoneNumber) // for upgrade button
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

    if(loading && clients.length === 0) return <p>Loading clients...</p>

    const openEdit = (client) =>{
      setEditClient(client)
      const [firstName,...lastParts] = client.name.split(' ');
      setForm({
        FirstName: firstName,
        LastName: lastParts.join(' '),
        PhoneNumber: client.phone,
        email: client.email,
        role: client.role
      })
      setShowModal(true)
    }

    const handleSaveClient = async (e) => {
      e.preventDefault();
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        if(editClient) {
          // CASE 2: EDIT
          const payload = {
            FirstName: form.FirstName,
            LastName:form.LastName,
            PhoneNumber: form.PhoneNumber.replace(/\s/g, ''),
            email: form.email,
            role: form.role
          }
          await axios.put(`http://localhost:3000/api/persons/${editClient.id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('Client updated');
        }
        else {
          // CASE 1: ADD WALK-IN
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
        if(err.response?.status === 401){
          toast.error('Session expired. Please login again')
          navigate('/login')
        }
       else{
         toast.error(err.response?.data?.message || 'Save failed'); // was .error
       }
      } finally {
        setLoading(false);
      }
    }

    const handleUpgrade = async (e) => {
      e.preventDefault();
      setLoading(true);
      console.log('SelecetdCient Object:',selectedClient)
      const token = localStorage.getItem('token');
      try {
        const payload = {
          tempToken: selectedClient.id,
          email: upgradeForm.email,
          password: upgradeForm.password,
        }
        console.log("Payload:",payload)
        await axios.post(`http://localhost:3000/api/persons/upgrade`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`${selectedClient.name} upgraded to Customer`);
        setShowModal(false);
        setUpgradeMode(false);
        setSelectedClient(null);
        setUpgradeForm({email: '', password: ''});
        fetchClients();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Upgrade failed');
      } finally {
        setLoading(false);
      }
    }

    const handleDeactivate = async () => {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:3000/api/persons/${deactivateClient.id}/deactivate`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Client deactivated');
        setShowDeactivateModal(false);
        setDeactivateClient(null);
        fetchClients();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to deactivate');
      }
    }

    const handleReactivate = async (id) => {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:3000/api/persons/${id}/reactivate`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.info('Client reactivated');
        fetchClients();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to reactivate');
      }
    }

    const filteredClients = clients.filter (c => (tab === 'all' || c.status === tab)
      &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email && c.email.toLowerCase().includes(search.toLowerCase()))
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
            {['all','pending','active','inactive'].map(t => ( // FIX: inactive -> deactive
              <button
                key={t}
                className={`tab-btn ${tab === t? 'active' : ''}`}
                onClick={() => setTab(t)}
                style={{
                  padding:'6px 12px', borderRadius:'8px', border:'1px solid #e5e7eb',
                  background: tab===t? '#111827' : '#fff', color: tab===t? '#fff' : '#111827',
                  textTransform:'capitalize', cursor:'pointer'
                }}
              >
                {t} ({clients.filter(c => t==='all' || c.status===t).length})
              </button>
            ))}
          </div>

          <div className="admin-client-body">
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
                  {loading? (
                    <tr><td colSpan="6">Loading...</td></tr>
                  ):filteredClients.length === 0?(
                    <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>No clients found</td></tr>
                  ):(
                    filteredClients.map(c=>(
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.phone}</td>
                            <td>{c.email}</td>
                            <td><span className={`badge badge-${c.role}`}>{c.role}</span></td>
                            <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                            <td>
                              <button className="btn-edit" onClick={() => openEdit(c)}>Edit</button>
                              
                              {c.status === 'active' && (
                                <button className="btn-delete" onClick={()=> {setDeactivateClient(c); setShowDeactivateModal(true)}}>
                                  Deactivate
                                </button>
                              )}

                              {c.status === 'inactive' && (
                                <button className="btn-reactivate" onClick={()=> handleReactivate(c.id)}>
                                  Reactivate
                                </button>
                              )}
                              
                              {c.role === 'walk-in' && c.status === 'active' &&(
                                <button 
                                  className="btn-upgrade" 
                                  onClick={() => openUpgradeModal(c)}
                                  disabled={c.phoneBlocked}
                                  title={c.phoneBlocked ? "This phone is already used by another Customer" : "Upgrade to Customer"}
                                  style={{
                                    opacity: c.phoneBlocked ? 0.5 : 1,
                                    cursor: c.phoneBlocked ? 'not-allowed' : 'pointer'
                                  }}
                                >
                                  {c.phoneBlocked ? 'Blocked' : 'Upgrade'}
                                </button>
                              )}
                            </td>
                        </tr>
                    ))
                  )}
                </tbody>
            </table>
          </div>
        </div>

        {/* MODAL: Add + Edit + Upgrade */}
        {showModal && (
          <div className="modal-overlay" onClick={() => {setShowModal(false); setEditClient(null);setUpgradeMode(false)}}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>
                {upgradeMode? `Upgrade ${selectedClient?.name}`: editClient? 'Edit Client' : 'Add New Client'}
              </h3>
              <form onSubmit={upgradeMode? handleUpgrade : handleSaveClient}>
                {upgradeMode? (
                  <>
                  <p style={{fontSize: '13px', color: '#6b7280', marginBottom: '16px'}}>
                      Set login credentials for this walk-in.They will be able to login immediately.
                    </p>
                    <label>Email</label>
                    <input required type="email" value={upgradeForm.email} onChange={(e) => setUpgradeForm({...upgradeForm, email: e.target.value})}/>
                    <label>Password</label>
                    <input required type="password" placeholder="Min 8 characters" value={upgradeForm.password} onChange={(e) => setUpgradeForm({...upgradeForm, password: e.target.value})}/>
                  </>
                ):(
                  <>
                    <label>First Name</label>
                    <input required value={form.FirstName} onChange={(e) => setForm({...form, FirstName: e.target.value})} />
                    <label>Last Name</label>
                    <input required value={form.LastName} onChange={(e) => setForm({...form, LastName: e.target.value})} />
                    <label>Phone</label>
                    <input required placeholder="088585858" value={form.PhoneNumber} onChange={(e) => setForm({...form, PhoneNumber: e.target.value})} maxLength={12}/>
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
                  <button type="submit" className="btn-save" disabled={loading}>{loading? 'Saving...':'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CONFIRM MODAL: Deactivate */}
        {showDeactivateModal && deactivateClient && ( // FIX: check showDeactivateModal
          <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
            <div className="modal" style={{maxWidth: '360px'}} onClick={(e) => e.stopPropagation()}>
              <h3>Deactivate Client?</h3>
              <p style={{margin: '12px 0', color: '#4b5563'}}>
                Are you sure you want to deactivate {deactivateClient.name}?
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDeactivateModal(false)}>Cancel</button>
                <button className="btn-delete" onClick={handleDeactivate}>Deactivate</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
}