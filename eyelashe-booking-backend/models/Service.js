// Import Mongoose for creating schemas and interacting with MongoDB
const mongoose = require('mongoose');

// Create a schema for the Service collection
const serviceSchema = new mongoose.Schema({

    // Name of the service (e.g., Hair Styling, Braiding, Makeup)
    name: {
        type: String,
        required: true
    },

    // Duration of the service in minutes
    // Example: 60 = 1 hour
    duration: {
        type: Number,
        required: true
    },

    // Price charged for the service
    // Example: 250.00
    price: {
        type: Number,
        required: true
    },

    // Indicates whether the service is currently available
    // Default value is true when a new service is created
    active: {
        type: Boolean,
        default: true
    },

    createdBy:{
        type:
        mongoose.Schema.Types.ObjectId,
        ref:'Person',
        required:true
    },
    approved :{
        type: Boolean,
        default:false //staff services start as pending

    },
    approvedBy :{
        type : 
        mongoose.Schema.Types.ObjectId,
        ref: 'Person' // which admin approved it 
    },

    // Stores the IDs of stylists who can perform this service
    // References documents in the Person collection
    stylistIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }]

},
{
    // Automatically adds:
    // createdAt - when the service was created
    // updatedAt - when the service was last modified
    timestamps: true
});

// Export the Service model
// This creates/uses the "services" collection in MongoDB
module.exports = mongoose.model('Service', serviceSchema);