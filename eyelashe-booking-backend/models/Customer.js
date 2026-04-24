const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');


// Defines the structure of a Customer document
const customerSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true// Each customer profile is linked to one user account, and vice versa
    },
  

    // Customer's first name (required)
    FirstName: { type: String, required: true },

    // Customer's last name (required)
    LastName: { type: String, required: true },

    // Customer's phone number (required)
    PhoneNumber: { type: String, required: true },

    // Whether the customer agreed to marketing (default = false)
    ConsentForMarketing: { type: Boolean, default: false },

    // Timestamp of when the customer profile was created (default = now)
    CreatedAt: { type: Date, default: Date.now }
   
});


module.exports = mongoose.model.Customer || mongoose.model('Customer', customerSchema);