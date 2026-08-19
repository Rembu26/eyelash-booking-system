const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    businessName: {
        type: String,
        dafault: 'Lash Studio'},
        phone:String,
        email:String,
        address:String,
        instagram:String,
        logo:String,// image url

        workingHours: {
           monday: {
                open: String,
                close: String,
                closed: Boolean
            },
            tuesday: {
                open: String,
                close: String,
                closed: Boolean
            },
            wednesday: {
                open: String,
                close: String,
                closed: Boolean
            },
            thursday: {
                open: String,
                close: String,
                closed: Boolean
            },
            friday: {
                open: String,
                close: String,
                closed: Boolean
            },
            saturday: {
                open: String,
                close: String,
                closed: Boolean
            },
            sunday: {
                open: String,
                close: String,
                closed: Boolean
            }
        },
        bookingSettings: {
            slotDuration: { type: Number, 
                default: 60 },// in minutes
        buffertime: { type: Number, default: 15 },// in minutes
        advanceBookingDays: { type: Number, default: 30 },// in days
        depositPercentage: { type: Number, default: 30 },// in percentage
            },
        },
        { timestamps: true }
    );

    module.exports = mongoose.model('Settings', SettingsSchema);
