// Import mongoose library (used to interact with MongoDB)
const mongoose = require('mongoose');


// =======================
// CUSTOMER SCHEMA
// =======================

// Defines the structure of a Customer document
const customerSchema = new mongoose.Schema({

    // Customer's first name (required)
    FirstName: { type: String, required: true },

    // Customer's last name (required)
    LastName: { type: String, required: true },

    // Customer's phone number (required)
    PhoneNumber: { type: String, required: true },

    // Customer's email address (required)
    EmailAddress: { type: String, required: true },

    // Reference to a Service document (relationship)
    // Stores the ObjectId of a Service
    PreferredServices: { type: mongoose.Schema.Types.ObjectId, ref: 'Services' },

    // Optional notes about the customer
    Notes: { type: String },

    // Whether the customer agreed to marketing (default = false)
    ConsentForMarketing: { type: Boolean, default: false }
});


// =======================
// SERVICE SCHEMA
// =======================

// Defines services offered (e.g., lashes, nails, etc.)
const serviceSchema = new mongoose.Schema({

    // Name of the service (required)
    ServiceName: { type: String, required: true },

    // Description of the service
    Description: { type: String },

    // Duration in minutes
    Duration: { type: Number },

    // Price of the service (required)
    Price: { type: Number, required: true }
});


// =======================
// APPOINTMENT SCHEMA
// =======================

// Defines booking/appointment data
const appointmentSchema = new mongoose.Schema({

    // Reference to Customer (foreign key)
    CustomerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true },

    // Reference to Service (foreign key)
    ServiceID: { type: mongoose.Schema.Types.ObjectId, ref: 'Services', required: true },

    // Date and time of appointment
    AppointmentDateTime: { type: Date, required: true },

    // Name of technician performing the service
    TechnicianName: { type: String },

    // Status of appointment
    Status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show'], // allowed values
        default: 'Scheduled'
    }
});


// =======================
// PAYMENT SCHEMA
// =======================

// Defines payment details for an appointment
const paymentSchema = new mongoose.Schema({

    // Reference to Appointment
    AppointmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointments', required: true },

    // Amount paid
    Amount: { type: Number, required: true },

    // Payment method (e.g., Cash, Card)
    PaymentMethod: { type: String, required: true },

    // Date of payment
    PaymentDate: { type: Date, required: true },

    // Payment status
    Status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    }
});


// =======================
// MODELS
// =======================

// Create models from schemas (these represent collections in MongoDB)
const Customers = mongoose.model('Customers', customerSchema);
const Services = mongoose.model('Services', serviceSchema);
const Appointments = mongoose.model('Appointments', appointmentSchema);
const Payments = mongoose.model('Payments', paymentSchema);


// Export models so they can be used in other files
module.exports = { Customers, Services, Appointments, Payments };