// Import React hooks
import { useEffect, useState } from "react";

// Import component styling
import './Booking.css';

// Available appointment time slots
const bookingTimes = [
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00'
];

export default function BookingForm({ onSubmit }) {

    // Stores the selected booking date
    const [selectedDate, setSelectedDate] = useState('');

    // Stores the selected booking time
    const [selectedTime, setSelectedTime] = useState('');

    // Stores services retrieved from the API
    const [services, setServices] = useState([]);

    // Stores stylists retrieved from the API
    const [staff, setStaff] = useState([]);

    // Stores the selected service ID
    const [serviceId, setServiceId] = useState('');

    // Stores the selected stylist ID
    const [stylistId, setStylistId] = useState('');

    // Stores logged-in client information
    const [clientInfo, setClientInfo] = useState({});

    // Runs once when the component loads
    useEffect(() => {

        // Fetch available services
        fetch('/api/services')
            .then(r => r.json())
            .then(setServices);

        // Fetch all stylists
        fetch('/api/persons?role=staff')
            .then(r => r.json())
            .then(setStaff);

        // Fetch currently logged-in user
        fetch('/api/persons/me')
            .then(r => r.json())
            .then(setClientInfo)
            .catch(err => console.error(err));

    }, []);

    // Generate the next 14 days for booking
    const getDates = () => {

        const dates = [];

        for (let i = 0; i < 14; i++) {

            const d = new Date();

            // Add i days to today's date
            d.setDate(d.getDate() + i);

            dates.push(d);
        }

        return dates;
    };

    // Handles booking submission
    const handleSubmit = (e) => {

        e.preventDefault();

        // Validate all required fields
        if (
            !selectedDate ||
            !selectedTime ||
            !stylistId ||
            !serviceId
        ) {
            alert('Please fill all fields');
            return;
        }

        // Send booking information to parent component
        onSubmit({
            selectedDate,
            selectedTime,
            stylistId,
            serviceId
        });
    };

    // Generate dates for the calendar
    const dates = getDates();

    return (
        <div className="booking-container">

            {/* ================= CLIENT INFORMATION CARD ================= */}
            <div className="client-card">

                {/* Display client initials */}
                <div className="client-avatar">
                    {clientInfo? `${clientInfo.FirstName}
                    ${clientInfo.LastName}  `:''}
                </div>

                {/* Display client details */}
                <div>
                    <h3>{clientInfo? clientInfo.fullName : 'Loading...'}</h3>
          <p>{clientInfo?.role} • {clientInfo?.email}</p>

                    <p>{clientInfo?.role}</p>

                    <p>{clientInfo?.email}</p>
                </div>

            </div>

            {/* ================= DATE SELECTION SECTION ================= */}
            <div className="calendar-section">

                <h4>Select Date</h4>

                <div className="calendar-grid">

                    {dates.map((date, i) => {

                        // Convert date to yyyy-mm-dd format
                        const dateStr =
                            date.toISOString().split('T')[0];

                        // Check if this date is selected
                        const isSelected =
                            selectedDate === dateStr;

                        return (
                            <button
                                key={i}
                                type="button"
                                className={`date-btn ${isSelected ? 'active' : ''}`}
                                onClick={() =>
                                    setSelectedDate(dateStr)
                                }
                            >

                                {/* Day abbreviation */}
                                <span className="day">
                                    {date.toLocaleDateString(
                                        'en',
                                        { weekday: 'short' }
                                    )}
                                </span>

                                {/* Day number */}
                                <span className="num">
                                    {date.getDate()}
                                </span>

                            </button>
                        );
                    })}

                </div>

            </div>

            {/* ================= TIME SLOT SECTION ================= */}
            <div className="slots-section">

                <h4>Available Time</h4>

                <div className="time-slots">

                    {bookingTimes.map(time => (

                        <button
                            key={time}
                            type="button"

                            // Highlight selected time
                            className={`time-btn ${selectedTime === time ? 'active' : ''}`}

                            // Save selected time
                            onClick={() =>
                                setSelectedTime(time)
                            }

                            // Disable until a date is selected
                            disabled={!selectedDate}
                        >
                            {time}
                        </button>

                    ))}

                </div>

                {/* Prompt user to choose a date first */}
                {!selectedDate &&
                    <p className="hint">
                        Pick a date first
                    </p>
                }

            </div>

            {/* ================= DROPDOWN SECTION ================= */}
            <div className="selectors">

                {/* Stylist Selection */}
                <div className="form-group">

                    <label>Stylist</label>

                    <select
                        value={stylistId}
                        onChange={(e) =>
                            setStylistId(e.target.value)
                        }
                    >
                        <option value="">
                            Select Stylist
                        </option>

                        {/* Populate stylists from API */}
                        {staff.map(s => (

                            <option
                                key={s._id}
                                value={s._id}
                            >
                                {s.fullName}
                            </option>

                        ))}

                    </select>

                </div>

                {/* Service Selection */}
                <div className="form-group">

                    <label>Service</label>

                    <select
                        value={serviceId}
                        onChange={(e) =>
                            setServiceId(e.target.value)
                        }
                    >
                        <option value="">
                            Select Service
                        </option>

                        {/* Populate services from API */}
                        {services.map(service => (

                            <option
                                key={service._id}
                                value={service._id}
                            >
                                {service.name} - R{service.price}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            {/* ================= SUBMIT BUTTON ================= */}
            <button
                className="submit-btn"
                onClick={handleSubmit}
            >
                Submit → Payment
            </button>

        </div>
    );
}