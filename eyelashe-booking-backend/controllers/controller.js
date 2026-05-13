const mongoose = require('mongoose');
require('dotenv').config();

const bcrypt = require('bcrypt'); 
const { sendEmail } = require('../mailer');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Person = require('../models/Person');


// // REGISTER FUNCTION
exports.register = async (req, res) => {

    
    try {
        const { FirstName, LastName, PhoneNumber, email, password, confirmPassword, consentForMarketing } = req.body;

        console.log('2. Validating...');
        console.log('Request body:', req.body);
        if (!email || !password || !confirmPassword || !FirstName || !LastName) {
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

        
        const existingUser = await Person.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: "Email already exists" });
        }

        console.log('4. Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        
       

        console.log('6. Creating person...');
        const person = await Person.create({
            FirstName,
            LastName,
            email,
            passwordHash: hashedPassword,
            role: 'customer',
            PhoneNumber,
            ConsentForMarketing: consentForMarketing || false,
            createdAt: new Date()
        });
        console.log('6. Person created:', person._id);

        console.log('8. Sending email...');
        try {
            await sendEmail(person.email, person.FirstName);
            console.log("8. Email sent");
        } catch (mailError) {
            console.error("Email failed but continuing:", mailError.message);
        }

        console.log('9. Generating token...');
        const token = jwt.sign(
            { id: person._id, role: person.role},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('10. DONE - Sending response');
        res.status(201).json({
            message: "Customer registered successfully 🎉!",
            token,
            user: { id: person._id, email: person.email, role: person.role, FirstName: person.FirstName, LastName: person.LastName }
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
        const person = await Person.findOne({email }).select('+passwordHash');
        if (!person ) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        //Check password
        const isMatch = await bcrypt.compare(password, person.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

       
        // Create JWT token
        const token = jwt.sign(
            { id: person._id, 
            role: person.role,
              }, 
            process.env.JWT_SECRET,// Secret key from .env file
            { expiresIn: '1h' }
        );
        //Send response with token
        res.json({
            message: "Login successful",
            token,
            user: {
              id: person._id,
              email: person.email,
              role: person.role,
              FirstName: person.FirstName,
              LastName: person.LastName
            }
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error' });
        }
    }
    

    