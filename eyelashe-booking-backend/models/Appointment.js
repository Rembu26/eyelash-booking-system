// Import Mongoose for creating schemas and interacting with MongoDB
const mongoose = require('mongoose');

// Create a schema for the Service collection
const appoitmentSchema = new mongoose.Schema({
    customer :{
        type:
        mongoose.Schema.Types.ObjectId,
        ref:'Person',
        required:true
    },
    staff:{
        type:
        mongoose.Schema.Types.ObjectId,
        ref:'Person' // null= Unassigned
    },
    service:{
        type:
        mongoose.Schema.Types.ObjectId,
        ref:'Service',
        required: true
    },
    date:{
        type:Date,
        required: true
    },
    status:{
        type:String,
        enum:['pending','confirmed','completed','cancelled'],
        default:'pending'
    },
    price:{
        type: Number // snaphot of services price at booking time
    },
    notes:{type:String}


},{timestamps:true});


// Export the Service model
// This creates/uses the "Appointment" collection in MongoDB
module.exports = mongoose.model('Appointment', appoitmentSchema);