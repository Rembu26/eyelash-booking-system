// Import React hooks
import { useState, useEffect } from "react";

// Import Add Service form component
import AddService from "./AddService";

import { useNavigate } from "react-router-dom";

// Import toast notifications (currently not used)
import {toast} from 'react-toastify';

// Import styling
import './Staff.css';

export default function MyServices() {

    // Stores all services belonging to the logged-in stylist
    const [services, setServices] = useState([]);

    // Controls whether the Add Service modal/form is displayed
    const [showForm, setShowForm] = useState(false);

    // Controls which tab is currently active
    // Possible values: 'all', 'approved', 'pending'
    const [tab, setTab] = useState('all');

    const navigate = useNavigate()

    // Fetch services belonging to the logged-in stylist
    const fetchServices = async () => {

        try{
            // Get JWT token from local storage
        const token = localStorage.getItem('token');

        // Call protected API endpoint
        const res = await fetch('/api/services/my', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if(!res.ok){
            const err = await res.json()
            console.log('Backend error:',err)
            setServices([]) //An empty array so .filter won't crash
            return
        }
        
        const data = await res.json()
        setServices(Array.isArray(data) ?
        data: [])

        }
        catch(e){
            setServices([])
        }
        

    };

    // Run once when component loads
    useEffect(() => {
        fetchServices();
    }, []);

    // Filter services based on selected tab
    const filtered = services.filter(service => {

        // Show only approved services
        if (tab === 'approved')
            return service.approved;

        // Show only pending services
        if (tab === 'pending')
            return !service.approved;

        // Show all services
        return true;
    });

    return (
        <div className="service-page">

            {/* ================= PAGE HEADER ================= */}
           <div className="service-header">

                <h2>My Services</h2>
            </div>

            {/*===================Service Section============== */}
            <div className="section-action">
                    <button
                        className="btn-back"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                    <button
                        className="btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        + Add New Service
                    </button>
            </div>

            {/* ================= FILTER TABS ================= */}
            <div className="tabs">

                {/* All Services Tab */}
                <button
                    className={
                        tab === 'all'
                            ? 'tab-active'
                            : 'tab'
                    }
                    onClick={() => setTab('all')}
                >
                    All
                </button>

                {/* Approved Services Tab */}
                <button
                    className={
                        tab === 'approved'
                            ? 'tab-active'
                            : 'tab'
                    }
                    onClick={() => setTab('approved')}
                >
                    Approved ✅
                </button>

                {/* Pending Services Tab */}
                <button
                    className={
                        tab === 'pending'
                            ? 'tab-active'
                            : 'tab'
                    }
                    onClick={() => setTab('pending')}
                >
                    Pending ↻
                </button>

            </div>

            {/* ================= ADD SERVICE FORM ================= */}
            {showForm && (
                <AddService
                    // Close the form
                    onClose={() => setShowForm(false)}

                    // Refresh service list after adding service
                    onAdded={fetchServices}
                />
            )}

            {/* ================= SERVICES LIST ================= */}
            <div className="service-list">

                {filtered.map(service => (

                    <div
                        key={service._id}
                        className="service-card"
                    >

                        {/* Service Name and Price */}
                        <h3>
                            {service.name} - R{service.price}
                        </h3>

                        {/* Service Duration */}
                        <p>
                            {service.duration} mins
                        </p>

                        {/* Approval Status Badge */}
                        <span
                            className={
                                service.approved
                                    ? 'badge-green'
                                    : 'badge-yellow'
                            }
                        >
                            {
                                service.approved
                                    ? 'Live'
                                    : 'Pending Approval'
                            }
                        </span>

                    </div>

                ))}

            </div>

        </div>
    );
}