
const mongoose = require('mongoose');
const personSchema = new mongoose.Schema(
    {
        FirstName: { 
            type: String, 
            required: true ,
            trim: true // Remove whitespace from both ends of the string
            ,
            maxlength: 50 // Limit the length of the name to 50 characters
        },
        LastName: { 
            type: String, 
            required: true ,
            trim: true,
            maxlength: 50
        },
        email: { 
            type: String, 
            required: true, 
            unique: true,
            lowercase: true, // Convert email to lowercase before saving
            trim: true,
           
        },
        passwordHash: { 
            type: String, 
            required: true
        },
        role: { 
            type: String, 
            enum: ['admin', 'staff', 'customer'], // Only allow specific roles
            default: 'customer' // Default role is customer
        },
        PhoneNumber: {
            type: String,
            trim: true,
            
        },
        //Stylist-specific fields, only filled if rolw === 'stylist'
        skills:[{type: 
            mongoose.Schema.Types.ObjectId,ref:
            'Service'}],
            bio:String,
            avatar:String
    },
        {
            timestamps: true, // Automatically add createdAt and updatedAt fields
            collection:"Person" // Set the collection name to "Person"
        }

    
);

module.exports = mongoose.model('Person', personSchema,'people');