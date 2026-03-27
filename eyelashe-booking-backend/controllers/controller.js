const User = require('../models/User');

// REGISTER FUNCTION
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const jwt = require('jsonwebtoken');
require('dotenv').config();

// LOGIN FUNCTION
exports.login = async (req, res) => {
    
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        //Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, 
                username: user.username,
            role: user.role },
            process.env.JWT_SECRET,// Secret key from .env file
            { expiresIn: '1h' }
        );
        //Send response with token
        res.json({
            message: "Login successful",
            token,
            role: user.role
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};