
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
            trim: true,// Remove whitespace from both ends of the string
            maxlength: 50 // limit the length of the name to 50 characters
        },
        email: { 
            type: String, 
            required: function(){
                return this.role === 'admin' || this.role === 'staff' || this.role === 'customer';
            },
             unique: true,
             sparse:true,
            lowercase: true, // Convert email to lowercase before saving
            trim: true,
           
           
        },
        passwordHash: { 
            type: String, 
            required: function(){
                return this.role === 'admin' || this.role === 'staff' || this.role === 'customer';
            }
        },
        role: { 
            type: String, 
            enum: ['admin', 'staff', 'customer','walk-in'], // Only allow specific roles
            default: 'customer' // Default role is customer
        },
        PhoneNumber: {
            type: String,
            required: true,
            unique: true
            
        },
        status :{
            type:String,
            enum:['pending','active','inactive'],
            default:'active'
        },
        otpCode:String,
        otpExpires:Date,

        //Stylist-specific fields, only filled if role === 'staff'
      // Stylist-specific fields - only for staff
        skills: {
            type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Service'}],
            validate: {
                validator: function(v) {
                    return this.role === 'staff' ? true : v.length === 0;
                },
                message: 'Skills can only be set for staff'
            },
            default: undefined
        },
        bio: { type: String, default: undefined },
        avatar: { type: String, default: undefined },
        isWalkIn: { type: Boolean, default: false }
    },

        {
            timestamps: true, // Automatically add createdAt and updatedAt fields
            minimize:true, // removes undefined fields from DB
            collection:"Person" // Set the collection name to "Person"
        }

    
);

module.exports = mongoose.model('Person', personSchema,'people');