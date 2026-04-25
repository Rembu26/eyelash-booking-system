const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddleware');
const {getMe} = require('../controllers/userController');


// Import your controller functions
const { register, login } = require('../controllers/controller');

// Route for registering a new user
router.post('/register', register);

// Route for logging in
router.post('/login', login);

// Route for getting the authenticated user's information
router.get('/me', protect, getMe);

// Export the router
module.exports = router;