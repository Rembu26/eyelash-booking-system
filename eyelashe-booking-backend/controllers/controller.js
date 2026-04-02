const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const { sendEmail } = require('../mailer');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Customer = require('../models/Customer');

// REGISTER FUNCTION
exports.register = async (req, res) => {

    const { username, email, password,confirmPassword } = req.body;

     // Basic validation
     if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const{
            firstName,
            lastName,
            phoneNumber,
            emailAdress,
            password,
            confirmPassword,
            preferredServices,
            notes,
            consentForMarketing

        }= req.body;




        //hash password with configurable salt rounds (default to 10 if not set in .env)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new Use.create({
            email: emailAdress,
            password: hashedPassword,
            role: 'customer',
            
        });

        //Create customer profile linked to user
        const customer = await Customer.create({
            user: user._id, // Link to User model
            FirstName: firstName,
            LastName: lastName,
            PhoneNumber: phoneNumber,
            EmailAddress: emailAdress,
            PreferredServices: preferredServices,
            Notes: notes,
            ConsentForMarketing: consentForMarketing
        });

        //Send email in a separate try-catch to avoid blocking registration if email fails
        try {
            await sendEmail(user.email, `${customer.FirstName}`);
            console.log("Email sent successfully to ", user.email);
            
        }
        catch (mailError) {
            console.error("Email failed: ", mailError);
            //Don't block registration if email fails, just log the error
        }

        //Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.status(201).json({ message: "Customer registered successfully 🎉!" });

    } catch (err) {
        if (err.code === 11000) { // Duplicate key error (username or email already exists)
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error("Registration error: ", err);
        res.status(500).json({ message:"Error registering user" ,err });
    }
};


require('dotenv').config();





// LOGIN FUNCTION
exports.login = async (req, res) => {
    
    try {
        const { emailAdress, password } = req.body;

        // Find user by username
        const user = await User.findOne({email: emailAdress });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        //Check password
        const isMatch = await bcrypt.compare(password, user.hashedPassword);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, 
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