const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const { sendEmail } = require('../mailer');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Customer = require('../models/Customer');
const e = require('express');


// // REGISTER FUNCTION
exports.register = async (req, res) => {



    console.log('1. ROUTE HIT. Body:', req.body);
    try {
        const { firstName, lastName, phoneNumber, email, password, confirmPassword, consentForMarketing } = req.body;

        console.log('2. Validating...');
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            console.log('Validation failed: missing fields');
            return res.status(400).json({ message: "All required fields must be filled" });
        }
        if (!validator.isEmail(email)) {
            console.log('Validation failed: bad email');
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password.length < 8) {
            console.log('Validation failed: short password');
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        if (password !== confirmPassword) {
            console.log('Validation failed: passwords dont match');
            return res.status(400).json({ message: "Passwords do not match" });
        }

        console.log('3. Checking if user exists...');
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: "Email already exists" });
        }

        console.log('4. Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('5. Creating user...');
        const user = await User.create({
            email,
            password: hashedPassword,
            role: 'customer'
        });
        console.log('5. User created:', user._id);

        console.log('6. Creating customer...');
        const customer = await Customer.create({
            user: user._id,
            FirstName: firstName,
            LastName: lastName,
            PhoneNumber: phoneNumber,
            ConsentForMarketing: consentForMarketing || false
        });
        console.log('6. Customer created:', customer._id);

        console.log('7. Linking customer to user...');
        user.customer = customer._id;
        await user.save();
        console.log('7. User updated with customer link');

        console.log('8. Sending email...');
        try {
            await sendEmail(user.email, customer.FirstName);
            console.log("8. Email sent");
        } catch (mailError) {
            console.error("Email failed but continuing:", mailError.message);
        }

        console.log('9. Generating token...');
        const token = jwt.sign(
            { id: user._id, role: user.role, customerId: customer._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('10. DONE - Sending response');
        res.status(201).json({
            message: "Customer registered successfully 🎉!",
            token,
            user: { id: user._id, email: user.email, role: user.role, customerId: customer._id }
        });

    } catch (err) {
        console.error("REGISTRATION CRASHED AT:", err);
        console.error("Error name:", err.name);
        console.error("Error code:", err.code);
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

   







// LOGIN FUNCTION
exports.login = async (req, res) => {
    
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password){
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Validate input
        const user = await User.findOne({email: email });
        if (!user ) {
            console.log('User not found for email:', email);
            return res.status(400).json({ message: "User not found" });
        }
        //Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        if(!user || !isMatch){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, 
            role: user.role,
             customerId: user.customer }, // Include customerId in token payload
            process.env.JWT_SECRET,// Secret key from .env file
            { expiresIn: '1h' }
        );
        //Send response with token
        res.json({
            message: "Login successful 💅!",
            token,
            user: { id: user._id, email: user.email, role: user.role} // Include customerId in response
        });


    } catch (err) {
        console.error("LOGIN CRASHED AT:", err);
        res.status(500).json({message: "Sever error",error: err.message });
    }
};