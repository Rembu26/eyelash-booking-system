const User = require('../models/User');
const Customer = require('../models/Customer');
const e = require('express');

exports.getMe = async (req, res) => {
    try {
        // Find the user by ID and exclude the password field
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the corresponding customer information
        const customer = await Customer.findById(req.user.customerId);
        res.json({
            id: user._id,
            email: user.email,
            role: user.role,
            firstName: customer?.firstName || '',   
            lastName: customer?.lastName || '',
            phoneNumber: customer?.phoneNumber || ''
        });


    } catch (error) {
        console.error('GetMe error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
}