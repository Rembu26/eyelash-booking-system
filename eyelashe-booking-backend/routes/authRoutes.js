const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {getMe} = require('../controllers/userController');
const {sendOtp,verifyOtp,upgradeToCustomer,createWalkIn} = require ('../controllers/authController');



// Import your controller functions
const { register, login } = require('../controllers/controller');

// Route for registering a new user
router.post('/register', register);

// Route for logging in
router.post('/login', login);


// Route for getting the authenticated user's information
router.get('/me', protect, getMe);

//Router for sending the otp via Whatsapp
router.post('/send-otp',sendOtp)

//Router for verying the OPT sent in Whatsapp
router.post('/verify-otp',verifyOtp)

//Router for upgrading from walk-in to customer role 
router.post('/upgrade',upgradeToCustomer)

//ADmin route to create a walk-in
router.post('/admin/create-walk-in',createWalkIn)


// Export the router
module.exports = router;