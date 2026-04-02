const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const { sendEmail } = require('../mailer');

// REGISTER FUNCTION
exports.register = async (req, res) => {

    const { username, email, password,confirmPassword } = req.body;

    // Basic validation
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        //Send email in a separate try-catch to avoid blocking registration if email fails
        try {
            await sendEmail(email, username);
        }
        catch (mailError) {
            console.error("Email failed: ", mailError);
            //Don't block registration if email fails, just log the error
        }


        res.status(201).json({ message: "User registered successfully 🎉!" });

    } catch (err) {
        if (err.code === 11000) { // Duplicate key error (username or email already exists)
            return res.status(400).json({ message: "Username or email already exists" });
        }
        console.error("Registration error: ", err);
        res.status(500).json({ message:"Error registering user" ,err });
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