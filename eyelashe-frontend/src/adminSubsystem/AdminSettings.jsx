import {useState, useEffect} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import './Admin.css';

const AdminSettings = () => {
    const [tabs, setTabs] = useState('business');
    const [form, setForm] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://localhost:3000/api/settings')
            .then((res) => {
                setForm(res.data);
            })
            .catch((err) => {
                console.error("❌ Error fetching settings:", err);
                toast.error("Error fetching settings");
            });
    }, []);

    // Function to handle form submission
    const handleChange = (e) => {
        // Handle nested form fields
        const { name, value } = e.target;
        if(name.includes('.')) {// Check if the name contains a dot, indicating a nested field
            // Split the name into parent and child keys    
            const [parent, child] = name.split('.');
            setForm({...form, [parent]:// Update the parent object with the new child value
        {...form[parent], [child]: value}});
        } else {
            // For non-nested fields, update the form state directly
            setForm({...form, [name]: value});
        }
    };  

    const handleHoursChange =(day, field, value) => {
        // Update the working hours for a specific day and field (open/close)
        setForm({
            ...form,
            workingHours: {
                ...form.workingHours,
                [day]: {
                    ...form.workingHours[day],
                    [field]: value
                }
            }
        });
    }

    const handleSave = async () => {
        // Save the updated settings to the server
        try {
            await axios.put('http://localhost:3000/api/settings', form, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Settings saved successfully");
        } catch (err) {
            console.error("Error saving settings:", err);
            toast.error("Error saving settings");
        }
    }

    if (!form) {
        return <div>Loading...</div>;
    }

    return (
        <div className="settings-page">
             <div className='settings-header'>
            <h2>Settings</h2>
            </div>

            {/* Render the form based on the selected tab */}
            <div className="settings-tabs">
                <button className={tabs === 'business' ? 'active' : ''} onClick={() => setTabs('business')}>Business Info</button>
                <button className={tabs === 'hours' ? 'active' : ''} onClick={() => setTabs('hours')}>Working Hours</button>
                <button className={tabs === 'booking' ? 'active' : ''} onClick={() => setTabs('booking')}>Booking Rules</button>
            </div>
            {tabs === 'business' && (
                <div className="card">
                    <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
                    <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram" />
                    <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
                </div>
            )}
            {tabs === 'hours' && (
                <div className="card">
                    {/* Render working hours form */}
                    {Object.keys(form.workingHours).map(day => (
                        <div key={day} className="hours-row">
                        <span>{day}</span>
                        <input type="time" value={form.workingHours[day]?.open || '09:00'} onChange={e =>handleHoursChange(day,'open',e.target.value)}/>
                        <input type="time" value={form.workingHours[day]?.close || '17:00'} onChange={e=> handleHoursChange(day,e.target.value)} />
                        <label >
                            <input type="checkbox" checked={form.workingHours[day]?.closed || false} onChange={e =>handleHoursChange(day,'closed',e.target.checked)}  />
                            Closed
                        </label>
                </div>
            ))}
            {tabs === 'booking' && (
                <div className="card">
                    {/* Render booking rules form */}   
                    <label>Slot Duration
                     <input type='number' name='bookingSettings.slotDuration' value={form.bookingsSetings.slotDuration} onChange={handleChange}/>
                    </label>
                    <label>Buffer Time (min)
                        <input type='number' name='bookingSettings.bufferTime' value={form.bookingsSetings.bufferTime} onChange={handleChange}/>
                    </label>
                    <label>Deposit %
                    <input type="number" name='bookingSettings.depositPercentage' value={form.bookingsSetings.depositPercentage} onChange={handleChange}/>
                    </label>
                   
                </div>
            )}

        
       </div>
    )}
    <button className='btn-save' onClick={handleSave}>
    Save All Settings
    </button>
    </div>
            
    );
};

export default AdminSettings;