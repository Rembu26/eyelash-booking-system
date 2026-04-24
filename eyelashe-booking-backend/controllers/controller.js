const User = require('../models/User');
const bcrypt = require('bcrypt'); 
const { sendEmail } = require('../mailer');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Customer = require('../models/Customer');
const { mongo } = require('mongoose');

// REGISTER FUNCTION
exports.register = async (req, res) => {

    const{
        
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        confirmPassword,
        preferredServices,
        notes,
        consentForMarketing

    }= req.body;


     // Basic validation
     if (!email|| !password || !confirmPassword) {
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

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        //Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }


        //hash password with configurable salt rounds (default to 10 if not set in .env)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user + customer profile in a single transaction to ensure data integrity
        const user = await User.create([{
            email,
            password: hashedPassword,
            role: 'customer',
            
        }], { session }); // No session for simplicity, but consider using transactions for production

        //Create customer profile linked to user
        const [customer] =    await Customer.create([{
            user: user._id, // Link to User model
            FirstName: firstName,
            LastName: lastName,
            PhoneNumber: phoneNumber,
            ConsentForMarketing: consentForMarketing
        }], { session });

        //Link customer profile back to user
        user.customer = customer._id;
        await user.save({ session });
        await session.commitTransaction();



        //Send email outside transaction so registration doesn't fail if email sending fails. We can retry sending email later if needed.

        try {
            await sendEmail(user.email, customer.FirstName);
            console.log("Email sent successfully to ", user.email);
            
        }
        catch (mailError) {
            console.error("Email failed: ", mailError);
            //Don't block registration if email fails, just log the error
        }

        //Generate JWT token
        const token = jwt.sign(
            { id: user._id,
             role: user.role,
             customerId: customer._id }, // Include customerId in token payload for easy access in protected routes
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.status(201).json({ 
            message: "Customer registered successfully 🎉!",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                customerId: customer._id
            }
        
        });

    } catch (err) {
        if (err.code === 11000) { // Duplicate key error (username or email already exists)
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error("Registration error: ", err);
        res.status(500).json({ message:"Error registering user" });
     }
    
     finally {
        await session.endSession();
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