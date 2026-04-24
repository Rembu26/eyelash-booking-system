const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },

    //reference to the customer profile (one-to-one relationship)
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },

    createdAt: { type: Date, default: Date.now }
});



// Compare password for login
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model.User || mongoose.model('User', userSchema);