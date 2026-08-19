import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const AdminStaff = () => {

  const navigate = useNavigate();
  const [search,setSearch] = useState('');
  const [tab,setTab] = useState('all');
  const [deleteStaff,setDeleteStaff] = useState(null);

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [showDeactivateModal,setShowDeactivateModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form, setForm] = useState({ FirstName: '', LastName: '', email: '', PhoneNumber: '', role: 'staff', password: '' });
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/persons/staff', { headers });
      setStaff(res.data.staff || res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/api/persons/${selectedStaff._id}`, form, { headers });
        toast.success('Staff updated');
      } else {
        await axios.post(`http://localhost:3000/api/persons/newStaff`, form, { headers });
        toast.success('Staff created successfully!');
      }
      setShowModal(false);
      setForm({ FirstName: '', LastName: '', email: '', PhoneNumber: '', role: 'staff', password: '' });
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (member) => {
    setSelectedStaff(member);
    setForm({ ...member, passwordHash: '' });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    
    try {
      
      await axios.patch(`http://localhost:3000/api/persons/${deleteStaff._id}/deleteStaff`,{}, { 
        headers
      });
      toast.warning('Staff has been deleted!');
      setShowDeactivateModal(false);
      setDeleteStaff(null);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deactivating');
    }
  };
  const handleReactivate = async(id) =>{
    try{
      await axios.patch(`http://localhost:3000/api/persons/${id}/reactivate`,{},
        {headers});
      toast.info('Staff is reactivated');
      fetchStaff();
    }catch(err){
      toast.error(err.response?.data?.message || 'Error');
    }

  };

  if (loading) return <p>Loading...</p>;

  const filteredStaff = staff.filter(s => {
  const status = s.status || 'active'; // treat missing as active
  if(tab === 'all') return true;
  if(tab === 'pending') return status === 'pending';
  return status === tab;
});
  return (
    <div className="admin-staff-page">
      <div className='admin-staff-card'>

        <div className='admin-staff-header'>
          <h2>Staff Management</h2>
        </div>
        
        <div className='admin-staff-toolbar'>
           <button className="staff-btn-back" onClick={() => navigate(-1)}>← Back</button>
            <input
              type="text"
              placeholder="Search by name,email....."
              className="staff-search"
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
            />
        <button 
          onClick={() => { setEditMode(false); setShowModal(true); setForm({ FirstName: '', LastName: '', email: '', PhoneNumber: '', role: 'staff', passwordHash: '' })}} 
          className="staff-btn-add"
        >
          + Add Staff
        </button>
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
                {t} ({staff.filter(c => t==='all' || c.status===t).length})
              </button>
            ))}
          </div>

          <div className='admin-staff-body'>
             <table className="admin-staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map(member => (
            <tr key={member._id} className={member.status ===
              'inactive'? 'row-inactive':''}>
              <td>{member.FirstName} {member.LastName}</td>
              <td><span className={`badge badge-${member.role}`}>{member.role}</span></td>
              <td>{member.email}</td>
              <td>{member.PhoneNumber}</td>
              <td>
                <span className={`status-badge ${member.status}`}>{member.status}</span>
              </td>
              
                <td>
                { member.status === 'inactive' ? (
                  <button className="btn-reactivate" onClick={() => handleReactivate(member._id)}>Reactive</button>

                ):(
                   <>
                 <button className="btn-edit" onClick={() => handleEdit(member)} >Edit</button>
                 <button className='btn-delete' onClick={() => {setDeleteStaff(member);setShowDeactivateModal(true)}} >Delete</button>
                </>
                )}
                </td>

                
               
              
            </tr>
          ))}
        </tbody>
      </table>
      
          </div>

       
      </div>


      

      {showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>{editMode ? 'Edit Staff' : 'Add Staff'}</h2>
      <form onSubmit={handleSubmit} className="staff-form">
        <input 
          placeholder="First Name" 
          value={form.FirstName || ''} 
          onChange={e => setForm({...form, FirstName: e.target.value})} 
          className="staff-input" 
          required 
        />
        <input 
          placeholder="Last Name" 
          value={form.LastName || ''} 
          onChange={e => setForm({...form, LastName: e.target.value})} 
          className="staff-input" 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={form.email || ''} 
          onChange={e => setForm({...form, email: e.target.value})} 
          className="staff-input" 
          required 
        />
        <input 
          placeholder="Phone" 
          value={form.PhoneNumber || ''} 
          onChange={e => setForm({...form, PhoneNumber: e.target.value})} 
          className="staff-input" 
        />
        <select 
          value={form.role} 
          onChange={e => setForm({...form, role: e.target.value})} 
          className="staff-select"
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        {!editMode && 
          <input 
            type="password" 
            placeholder="Password" 
            value={form.password || ''} 
            onChange={e => setForm({...form, password: e.target.value})} 
            className="staff-input" 
            required 
          />
        }
        <div className="modal-actions">
          <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
          <button type="submit" className="btn-save">Save</button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* CONFIRM MODAL: Deactivate */}
        {showDeactivateModal && deleteStaff && ( // FIX: check showDeactivateModal
          <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
            <div className="modal" style={{maxWidth: '360px'}} onClick={(e) => e.stopPropagation()}>
              <h3>Delete Staff?</h3>
              <p style={{margin: '12px 0', color: '#4b5563'}}>
                Are you sure you want to delete {deleteStaff.FirstName} {deleteStaff.LastName}?
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowDeactivateModal(false)}>Cancel</button>
                <button className="btn-delete" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      
    </div>
  );
};

export default AdminStaff;